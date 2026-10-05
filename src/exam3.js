/* Exam 3 content pack: Benefits (textbook draft), Slides 09 (Compa-Ratios & Payroll) and 10 (Executives & the Flexible Workforce).
   9/30: added the Exam 3 Practice Set (25 MC, 10 T/F, 6 word problems, keyed) and cards/cues from the Exam 3 Study Guide.
   Sources: lecture slides 09–10, Exam 2 Study Guide Parts 4–5, Practice Set WP6–7 and MC 8–11 (with key).
   Questions marked "written from" were authored for practice from those exact slide lines.
   Kathleen (9/23) and Derek Story (9/30) are included from Wesley's notes. */
window.EXAM3_DATA = (() => {
  const S9 = 'Slides 09 · Compa-Ratios & Payroll', S10 = 'Slides 10 · Executives & Flexible Workforce';
  const P4 = 'Study Guide Part 4', P5 = 'Study Guide Part 5';
  let n = 0;
  const q = (topic, prompt, options, answer, explanation, source) => ({ id: 'e3-' + (++n), topic, prompt, options, answer, answerKeyText: options[answer], explanation, source });
  const questions = [
    // practice set, keyed
    q('compa', 'A compa-ratio of 1.32 means the employee is:', ['Paid below the midpoint, within the ideal range', 'Paid at the midpoint', 'Paid above the midpoint, outside the ideal range', 'Misclassified'], 2, 'Above 1.0 = above average; the ideal range is 0.75–1.25, so 1.32 is outside it.', 'Practice Set MC 8 · key'),
    q('flex', 'A worker uses their own tools, is paid per project, and serves several clients. They are most likely a(n):', ['Core employee', 'Leased employee', 'Independent contractor', 'Part-time employee'], 2, 'Own tools, paid by the project, and more than one business are contractor factors on the common-law test.', 'Practice Set MC 9 · key'),
    q('exec', 'About what share of CEO pay is base salary?', ['8.7%', '30%', '50%', '81%'], 0, 'Base salary accounted for just 8.7%; long- and short-term incentives are the bulk.', 'Practice Set MC 10 · key'),
    q('flex', 'Part-time workers who resign can buy continued health coverage under:', ['PPACA', 'ERISA', 'COBRA', 'FUTA'], 2, 'Following resignation, part-time workers are eligible to purchase health insurance under COBRA rules.', 'Practice Set MC 11 · key'),
    // compa-ratios (written from Slides 09)
    q('compa', 'A compa-ratio helps an organization understand how it pays employees relative to which two areas?', ['Internal pay policy and market value', 'Seniority and merit', 'Base pay and bonuses', 'Federal and state law'], 0, 'The slide lists 1. Internal Pay Policy and 2. Market Value.', 'Written from ' + S9),
    q('compa', 'What is the ideal compa-ratio range?', ['0.50 – 1.00', '0.75 – 1.25', '0.90 – 1.10', '1.00 – 1.50'], 1, 'Ideal Compa-Ratio Range: .75 – 1.25.', 'Written from ' + S9),
    q('compa', 'A compa-ratio of exactly 1.0 means the organization is paying:', ['Below average', 'At average', 'Above average', 'Outside the ideal range'], 1, 'At 1.0 means we are paying at average.', 'Written from ' + S9),
    q('compa', 'Internally, what can HR do about HIGH compa-ratios?', ['Give frequent increases', '"Freeze" employee increases', 'Reclassify them as contractors', 'Lower the range minimum'], 1, 'High compa-ratios: we can “freeze” employee increases to bring them more in line with our pay policy.', 'Written from ' + S9),
    q('compa', 'Internally, what does the slide suggest for LOW compa-ratios?', ['Freeze their pay', 'Work on bringing these employees in line with internal pay policy', 'Move them to a lower grade', 'Nothing; low is ideal'], 1, 'Low compa-ratios: we can work on bringing these employees in line with our internal pay policy.', 'Written from ' + S9),
    q('compa', 'Which caveat does the slide give about high compa-ratios?', ['They always mean overpayment', 'Highly experienced, long-tenured employees may have much higher pay', 'They only happen to executives', 'They violate the FLSA'], 1, 'Caveat: highly experienced, long-tenured employees may have much higher pay, among other variables.', 'Written from ' + S9),
    q('compa', 'Externally, a HIGH compa-ratio against market value means the company:', ['Is paying below market', 'Is likely attracting top talent but may consider decreasing pay depending on how far above', 'Must freeze pay immediately', 'Is out of FLSA compliance'], 1, 'High = paying above market value; likely attracting top talent, but may want to consider decreasing pay depending on how far above.', 'Written from ' + S9),
    q('compa', 'An employee earns $46,750 in a grade with a $55,000 midpoint. The compa-ratio is:', ['0.72', '0.85', '1.00', '1.18'], 1, '46,750 ÷ 55,000 = 0.85: below average but inside the 0.75–1.25 ideal range.', 'Written from ' + P4 + ' example'),
    // payroll
    q('payroll', 'Payroll is best defined as:', ['The process of compensating employees for their work: calculating earnings, deductions and taxes, and issuing payments', 'The total of all bonuses paid in a year', 'A salary survey of competitors', 'The range between min and max pay'], 0, 'What is payroll: the process of compensating employees; involves calculating earnings, deductions, taxes and issuing payments.', 'Written from ' + S9),
    q('payroll', 'Take-home pay after all deductions is called:', ['Gross pay', 'Net pay', 'Pay level', 'Base pay'], 1, 'Net pay: take-home pay after all deductions. Gross pay is total earnings before deductions.', 'Written from ' + S9),
    q('payroll', 'Which is the FIRST step in the payroll process?', ['Calculations', 'Disbursement', 'Time collection', 'Reporting'], 2, '1 Time collection → 2 Approval & entry → 3 Calculations → 4 Review & audit → 5 Disbursement → 6 Reporting.', 'Written from ' + S9),
    q('payroll', 'Step 4 of the payroll process, the accuracy check, is:', ['Approval & entry', 'Review & audit', 'Disbursement', 'Time collection'], 1, 'Review & Audit: accuracy check.', 'Written from ' + S9),
    q('payroll', 'How long should payroll records be kept, per the slide?', ['At least 1 year', 'At least 3–4 years', 'At least 10 years', 'Until the employee leaves'], 1, 'Recordkeeping: maintain for at least 3–4 years.', 'Written from ' + S9),
    q('payroll', 'Which tax is paid by the EMPLOYER, not withheld from the employee?', ['Federal income tax', 'State income tax', 'FUTA & SUTA', 'The employee share of FICA'], 2, 'Employer-paid: employer portion of FICA and FUTA & SUTA (federal and state unemployment taxes).', 'Written from ' + S9),
    q('payroll', 'The Social Security and Medicare tax rates add up to:', ['6.20%', '1.45%', '7.65%', '15.30%'], 2, 'Social Security 6.20% + Medicare 1.45% = total payroll taxes 7.65%.', 'Written from ' + S9),
    q('payroll', 'If an employee earns $1,000, how much Social Security + Medicare is withheld?', ['$62.00', '$14.50', '$76.50', '$100.00'], 2, '$62.00 + $14.50 = $76.50, sent to the federal government.', 'Written from ' + S9),
    q('payroll', 'Angela earns $2,000 gross with $124 Social Security, $29 Medicare, $237 income tax and $50 retirement. Her net pay is:', ['$1,560', '$1,610', '$1,763', '$1,847'], 0, '2,000 − 124 − 29 − 237 − 50 = $1,560. Her employer sends $390 to the federal government and $50 to the retirement fund.', 'Written from ' + S9 + ' (Angela example)'),
    q('payroll', 'Which is listed as a common payroll MISTAKE?', ['Using automated systems', 'Misclassifying employees (W-2 vs 1099)', 'Regular audits', 'Communicating clearly'], 1, 'Common challenges: misclassifying employees (W-2 vs 1099), incorrect tax calculations, late filings, poor documentation, manual entry errors.', 'Written from ' + S9),
    q('payroll', 'Workday, ADP, Paychex and Gusto are examples of:', ['Salary surveys', 'HRIS & payroll systems', 'Unemployment taxes', 'Incentive plans'], 1, 'Payroll systems & technology: Workday, ADP, Paychex, Gusto, etc.', 'Written from ' + S9),
    // flexible workforce
    q('flex', 'Contingent (flexible) workers are individuals who:', ['Plan on long-term employment', 'Do not have an implicit or explicit contract for ongoing employment', 'Are always part-time', 'Work only for the government'], 1, 'Flexible/contingent workers do not have an implicit or explicit contract for ongoing employment; core employees plan on long-term relationships.', 'Written from ' + S10),
    q('flex', 'Someone who won’t continue employment because they are returning to school is:', ['A contingent worker', 'NOT a contingent worker', 'A leased employee', 'An independent contractor'], 1, 'People who do not expect to continue for personal reasons such as returning to school or retirement are not contingent workers.', 'Written from ' + S10),
    q('flex', 'Two or more part-timers performing one job is called:', ['Telecommuting', 'Job sharing', 'Compressed workweek', 'Leasing'], 1, 'Job sharing: reduces costs, increases flexibility, maintains productivity, may increase loyalty.', 'Written from ' + S10),
    q('flex', 'Which is NOT a listed reason for the rise in flexible workers?', ['Economic recessions', 'International competition', 'Shift from manufacturing to a service economy', 'New federal overtime rules'], 3, 'The slide lists recessions, international competition, and the shift from manufacturing to a service economy.', 'Written from ' + S10),
    q('flex', 'About what share of part-time workers have retirement benefits, vs full-time?', ['38% vs 81%', '81% vs 38%', '50% vs 50%', '8.7% vs 91%'], 0, 'Retirement benefits: about 38% of part-time workers compared to 81% of full-time workers.', 'Written from ' + S10),
    q('flex', 'Employers must let part-timers join retirement plans after they meet the age and service requirements of:', ['COBRA', 'ERISA', 'PPACA', 'FLSA'], 1, 'Part-time workers must be allowed to participate after fulfilling the ERISA age and service requirements.', 'Written from ' + S10),
    q('flex', 'Part-time workers are NOT protected under:', ['PPACA', 'COBRA', 'ERISA', 'FICA'], 0, 'Health insurance: part-time workers are not protected under PPACA.', 'Written from ' + S10),
    q('flex', 'Flextime, compressed workweeks and telecommuting are examples of:', ['Flexible work schedules', 'Contingent worker types', 'Perquisites', 'Payroll steps'], 0, 'Flexible work schedules: flextime, compressed workweeks, telecommuting.', 'Written from ' + S10),
    q('flex', 'When flexible employees work during holidays, companies must:', ['Pay triple time', 'Provide alternative time off', 'Convert them to full-time', 'Nothing'], 1, 'Treatment of paid time off for holidays: companies must provide alternative time off.', 'Written from ' + S10),
    q('flex', 'Under the COMMON-LAW test, a worker paid by the hour, supervised, using the employer’s tools is:', ['An employee', 'An independent contractor', 'A leased employee', 'A consultant'], 0, 'Employee if the employer controls/supervises, provides tools and location, and pays by the hour or time worked.', 'Written from ' + S10),
    q('flex', 'Which factor appears in the ECONOMIC REALITIES test?', ['Intent of the parties', 'Opportunity for profit or loss (risk)', 'Method of payment', 'Type of business'], 1, 'Economic realities factors: integration, investment in facilities, right to control, risk (profit or loss), skill, continuing relationship.', 'Written from ' + S10),
    q('flex', 'A worker with a substantial investment in the work facilities and equipment points toward:', ['Employee status', 'Independent contractor status', 'Part-time status', 'Leased status'], 1, 'Economic realities test: substantial investment in facilities and equipment → contractor.', 'Written from ' + S10),
    // executives
    q('exec', 'Which is NOT one of the five elements of an executive compensation package?', ['Base salary', 'Long-term incentives', 'Perquisites', 'Overtime pay'], 3, 'The five: base salary, short-term incentives/bonuses, long-term incentives, benefits, perquisites.', 'Written from ' + S10),
    q('exec', 'Stock options and stock grants are examples of:', ['Short-term incentives', 'Long-term incentives', 'Perquisites', 'Benefits'], 1, 'Long-term incentives (for example, stock options and stock grants).', 'Written from ' + S10),
    q('exec', 'The bulk of CEO pay comes from:', ['Base salary', 'Benefits', 'Long-term and short-term incentives', 'Perquisites'], 2, 'Long-term and short-term incentives account for the bulk of CEO pay.', 'Written from ' + S10),
    q('exec', 'Executive annual bonuses are designed to:', ['Motivate better short-term performance', 'Replace base salary', 'Satisfy ERISA', 'Reduce FICA taxes'], 0, 'Bonuses are designed to motivate better short-term performance.', 'Written from ' + S10),
    q('exec', 'The three common measures for executive bonuses are:', ['Profit, revenue, and cash flow', 'Tenure, merit, and skill', 'Stock, benefits, and perks', 'Turnover, absenteeism, and safety'], 0, 'Three common measures are profit, revenue, and cash flow.', 'Written from ' + S10),
    q('exec', 'Non-financial measures for executive bonuses can be:', ['Strategic, individual, or discretionary', 'Federal, state, or local', 'Weekly, monthly, or yearly', 'Fixed, variable, or deferred'], 0, 'Non-financial measures can be strategic, individual, or discretionary.', 'Written from ' + S10),
    q('exec', 'A company car and a club membership for an executive are:', ['Long-term incentives', 'Perquisites', 'Short-term incentives', 'Base salary'], 1, 'Perks such as these are perquisites, the fifth element of the package.', 'Written from ' + P5)
  ];

  let c = 0;
  const card = (topic, front, back, source, core = true) => ({ id: 'e3c-' + (++c), topic, front, back, source, core });
  const flashcards = [
    card('compa', 'Compa-ratio', 'Shows how pay compares to (1) internal pay policy (range midpoint) and (2) market value.', S9),
    card('compa', 'Compa-ratio formula', 'Employee’s actual pay ÷ range midpoint (or ÷ market rate for an external comparison).', P4),
    card('compa', 'Reading a compa-ratio', '< 1.0 below average · = 1.0 at average · > 1.0 above average.', S9),
    card('compa', 'Ideal compa-ratio range', '0.75 – 1.25', S9),
    card('compa', 'Low compa-ratio, internal fix', 'Bring employees in line with internal pay policy.', S9),
    card('compa', 'High compa-ratio, internal fix', '“Freeze” increases, unless tenure/experience justifies higher pay.', S9),
    card('compa', 'Low compa-ratio vs market', 'Paying below market value; consider increasing pay for the affected positions.', S9),
    card('compa', 'High compa-ratio vs market', 'Paying above market; likely attracting top talent, but consider decreasing depending on how far above.', S9),
    card('payroll', 'Payroll', 'The process of compensating employees: calculating earnings, deductions and taxes, and issuing payments.', S9),
    card('payroll', 'Gross pay', 'Total earnings before deductions.', S9),
    card('payroll', 'Net pay', 'Take-home pay after all deductions.', S9),
    card('payroll', 'Payroll deductions', 'Taxes, insurance, retirement, garnishments.', S9),
    card('payroll', 'Payroll process: 6 steps', '1 Time collection → 2 Approval & entry → 3 Calculations → 4 Review & audit → 5 Disbursement → 6 Reporting.', S9),
    card('payroll', 'Payroll compliance', 'FLSA (min wage, OT) · IRS guidelines · state/local laws · W-2 / W-4 / 1099 · keep records 3–4 years.', S9),
    card('payroll', 'Employee-paid payroll taxes', 'Federal income tax · state/local income tax · Social Security & Medicare (FICA).', S9),
    card('payroll', 'Employer-paid payroll taxes', 'Employer portion of FICA · FUTA & SUTA (federal and state unemployment).', S9),
    card('payroll', 'FUTA & SUTA', 'Federal and state unemployment taxes, paid by the employer.', S9),
    card('payroll', 'FICA rates', 'Social Security 6.20% + Medicare 1.45% = 7.65% of gross.', S9),
    card('payroll', 'Net pay formula', 'Net = Gross − Social Security − Medicare − income tax − other deductions (retirement, insurance).', P4),
    card('payroll', 'Common payroll mistakes', 'Misclassifying W-2 vs 1099 · wrong tax calcs · late filings · poor documentation · manual entry errors.', S9),
    card('payroll', 'Payroll best practices', 'Automated systems · regular audits · stay updated on law changes · communicate clearly.', S9, false),
    card('payroll', 'Payroll systems examples', 'Workday, ADP, Paychex, Gusto.', S9, false),
    card('flex', 'Contingent (flexible) worker', 'No implicit or explicit contract for ongoing employment.', S10),
    card('flex', 'Core employee', 'Plans on a long-term or indefinite relationship with the employer.', S10),
    card('flex', 'Leaving to return to school or retire', 'NOT a contingent worker.', S10),
    card('flex', 'Types of contingent workers', 'Part-time · temporary & on-call · leased employees · independent contractors, freelancers, consultants.', S10),
    card('flex', 'Job sharing', 'Two or more part-timers perform one job: cuts costs, adds flexibility, keeps productivity, may raise loyalty.', S10),
    card('flex', 'Why flexible workers are rising', 'Recessions · international competition · shift from manufacturing to a service economy.', S10),
    card('flex', 'Retirement access: part-time vs full-time', 'About 38% vs 81%.', S10),
    card('flex', 'ERISA and part-timers', 'Must be allowed into retirement plans after meeting ERISA age and service requirements.', S10),
    card('flex', 'PPACA and part-timers', 'Part-time workers are NOT protected under PPACA.', S10),
    card('flex', 'COBRA and part-timers', 'After resigning, part-timers can buy health insurance under COBRA.', S10),
    card('flex', 'Flexible work schedules', 'Flextime · compressed workweeks · telecommuting.', S10),
    card('flex', 'Holidays for flexible employees', 'If they work a holiday, the company must provide alternative time off.', S10),
    card('flex', 'Common-law test: employee signs', 'Employer controls details, supervises, provides tools/location; paid by the hour; extended relationship; one employer.', S10),
    card('flex', 'Common-law test: contractor signs', 'Worker controls details, specialized skill, own tools/site, paid by the project, limited time, several businesses.', S10),
    card('flex', 'Economic realities test factors', 'Integration · investment in facilities · right to control · risk (profit/loss) · skill · continuing relationship.', S10),
    card('exec', 'Five elements of executive pay', 'Base salary · short-term incentives · long-term incentives · benefits · perquisites.', S10),
    card('exec', 'CEO base salary share', 'Just 8.7%; incentives are the bulk.', S10),
    card('exec', 'Long-term incentives', 'Stock options and stock grants.', S10),
    card('exec', 'Executive annual bonus purpose', 'Motivate better short-term performance; nearly every private-sector executive has one.', S10),
    card('exec', 'Common executive bonus measures', 'Profit, revenue, and cash flow.', S10),
    card('exec', 'Non-financial bonus measures', 'Strategic, individual, or discretionary.', S10),
    card('exec', 'Perquisites', 'Executive perks (the fifth element), e.g. a company car or club membership.', P5)
  ];

  let k = 0;
  const cue = (topic, clue, answer, source) => ({ id: 'e3q-' + (++k), topic, clue, answer, source });
  const cues = [
    cue('compa', '"compa-ratio of 1.30"', 'above the ideal range → freeze / overpaid vs policy', P4),
    cue('compa', '"compa-ratio of 0.70"', 'below the ideal range → raise pay', P4),
    cue('compa', '"pay vs midpoint"', 'compa-ratio; compare to 0.75–1.25', P4),
    cue('payroll', '"unemployment tax paid by the employer"', 'FUTA/SUTA', P4),
    cue('payroll', '"take-home pay"', 'net pay', P4),
    cue('payroll', '"gross pay, deductions"', 'FICA 7.65% (6.2 + 1.45) → net pay', P4),
    cue('flex', '"two part-timers split one position"', 'job sharing', P5),
    cue('flex', '"quitting to go back to school"', 'NOT contingent', P5),
    cue('flex', '"retirement plan eligibility for part-timers"', 'ERISA', P5),
    cue('flex', '"keep health insurance after leaving"', 'COBRA', P5),
    cue('flex', '"paid by the project, own tools, several clients"', 'independent contractor', P5),
    cue('flex', '"opportunity for profit or loss" / "investment"', 'economic realities test', P5),
    cue('exec', '"stock options"', 'long-term incentives', P5),
    cue('exec', '"company car, club membership"', 'perquisites', P5)
  ];

  const math = [
    { id: 'e3m-wp6', title: 'WP6 · Compa-ratios (÷ 55,000)', topic: 'compa', type: 'compa', source: 'Practice Set WP6 · key', origin: 'notes',
      prompt: 'All five employees are in a grade with a $55,000 midpoint. Find each compa-ratio (2 decimals).',
      table: { headers: ['Employee', 'Pay'], rows: [['Jordan', 46750], ['Priya', 55000], ['Marcus', 64900], ['Elena', 39600], ['Tyler', 70400]] },
      fields: [['Jordan', 0.85], ['Priya', 1.00], ['Marcus', 1.18], ['Elena', 0.72], ['Tyler', 1.28]].map(([nm, a], i) => ({ id: 'c' + i, label: nm + ' compa-ratio', answer: a, unit: '', tolerance: 0.005 })),
      steps: ['Compa-ratio = pay ÷ midpoint.', 'Jordan 46,750 ÷ 55,000 = 0.85 (below, inside range) · Priya 1.00 (at average) · Marcus 1.18 (above, inside) · Elena 0.72 (below, OUTSIDE → raise pay) · Tyler 1.28 (above, OUTSIDE → freeze increases unless tenure justifies it).'] },
    { id: 'e3m-wp7', title: 'WP7 · Net pay', topic: 'payroll', type: 'netpay', source: 'Practice Set WP7 · key', origin: 'notes',
      prompt: 'Devon earns $3,200/month gross. Federal income tax withheld is $310 and he puts $150/month into his 401(k). Find Social Security, Medicare, net pay, and what the employer sends to the federal government.',
      fields: [{ id: 'ss', label: 'Social Security', answer: 198.4, unit: '$', tolerance: 0.01 }, { id: 'med', label: 'Medicare', answer: 46.4, unit: '$', tolerance: 0.01 }, { id: 'net', label: 'Net pay', answer: 2495.2, unit: '$', tolerance: 0.01 }, { id: 'fed', label: 'Sent to federal government', answer: 554.8, unit: '$', tolerance: 0.01 }],
      steps: ['SS = 3,200 × 6.2% = 198.40.', 'Medicare = 3,200 × 1.45% = 46.40.', 'Net = 3,200 − 198.40 − 46.40 − 310 − 150 = 2,495.20.', 'Federal = 198.40 + 46.40 + 310 = 554.80 (the 401(k) goes to the retirement fund).'] },
    { id: 'e3m-angela', title: 'Slide example · Angela’s net pay', topic: 'payroll', type: 'netpay', source: S9, origin: 'notes',
      prompt: 'Angela earns $2,000 a month. Her employer withholds $237 income tax and $50 for retirement. Find Social Security, Medicare, net pay, and the amount sent to the federal government.',
      fields: [{ id: 'ss', label: 'Social Security', answer: 124, unit: '$', tolerance: 0.01 }, { id: 'med', label: 'Medicare', answer: 29, unit: '$', tolerance: 0.01 }, { id: 'net', label: 'Net pay', answer: 1560, unit: '$', tolerance: 0.01 }, { id: 'fed', label: 'Sent to federal government', answer: 390, unit: '$', tolerance: 0.01 }],
      steps: ['SS = 2,000 × 6.2% = 124.', 'Medicare = 2,000 × 1.45% = 29.', 'Net = 2,000 − 124 − 29 − 237 − 50 = 1,560.', 'Federal = 124 + 29 + 237 = 390; $50 goes to the retirement fund.'] }
  ];


  /* ---------- 9/29 additions: Exam 3 Practice Set (keyed) + Exam 3 Study Guide ----------
     Benefits items come from the textbook (Ch. 12–13) because the Benefits deck isn't in the folder yet. */
  const PS = 'Exam 3 Practice Set', SG = 'Exam 3 Study Guide', TB = ' (textbook — check vs Benefits deck)';
  const TF = ['True', 'False'];
  questions.push(
    q('benefits', 'Employee benefits are best defined as the part of the total compensation package that is:', ['Paid in cash on a delayed schedule', 'Other than pay for time worked', 'Required by federal statute', 'Negotiated by a union'], 1, 'The definition is “other than pay for time worked.” (c) is wrong because most benefits are discretionary.', PS + ' A1 · key' + TB),
    q('benefits', 'Benefits account for approximately what share of total compensation for U.S. private industry workers?', ['10%', '20%', '30%', '42%'], 2, '30% of total compensation. 42% is the ratio to wages and salaries only, the classic distractor.', PS + ' A2 · key' + TB),
    q('benefits', 'Which was the original catalyst for the growth of employee benefits in the 1940s and 1950s?', ['ERISA', 'Wage and price controls', 'The Affordable Care Act', 'The shift to a service economy'], 1, 'Wage and price controls during WWII and Korea: employers couldn’t raise wages, so they competed on benefits.', PS + ' A3 · key' + TB),
    q('compa', 'An employee’s actual pay is $54,000 and the midpoint of her pay range is $60,000. Her compa-ratio is:', ['0.90, paying below average', '0.90, paying above average', '1.11, paying above average', '1.11, paying below average'], 0, '54,000 ÷ 60,000 = 0.90, below 1.0 = paying below average.', PS + ' A4 · key'),
    q('compa', 'An employee’s compa-ratio is 1.38 relative to internal pay policy. The most appropriate response is to:', ['Immediately cut pay to the midpoint', 'Freeze increases, while considering tenure and experience', 'Promote the employee to the next grade', 'Do nothing, since 1.38 is within the ideal range'], 1, 'Freeze increases, with the slide’s caveat about long-tenured, highly experienced employees. 1.38 is outside 0.75–1.25.', PS + ' A5 · key'),
    q('payroll', 'Total FICA withheld from an employee’s pay is:', ['6.20%', '1.45%', '7.65%', '15.30%'], 2, '6.20% + 1.45% = 7.65%. 15.30% is employee plus employer combined.', PS + ' A7 · key'),
    q('payroll', 'Which of the following is paid by the employer only?', ['Federal income tax withholding', 'The employee’s share of Medicare', 'FUTA and SUTA', 'A 401(k) elective deferral'], 2, 'FUTA and SUTA are employer-only. The employer matches FICA, but the employee pays FICA too.', PS + ' A8 · key'),
    q('payroll', 'In the payroll process, which step comes immediately before disbursement?', ['Time collection', 'Calculations', 'Review and audit', 'Reporting'], 2, 'Time collection → approval & entry → calculations → review & audit → disbursement → reporting.', PS + ' A9 · key'),
    q('payroll', 'A worker who receives a 1099 rather than a W-2 is being treated as:', ['An exempt employee', 'A leased employee', 'An independent contractor', 'A part-time employee'], 2, '1099 = independent contractor. Misclassifying W-2 vs. 1099 is a listed common payroll mistake.', PS + ' A10 · key'),
    q('flex', 'Which of the following individuals is NOT a contingent worker?', ['A part-time cashier', 'A seasonal warehouse worker hired through December 31', 'An employee who plans to leave in May to return to graduate school', 'A consultant engaged for a six-month project'], 2, 'Leaving for personal reasons (school, retirement) does not make someone contingent. The prof repeated this in the video.', PS + ' A11 · key'),
    q('flex', 'A leased employee is legally the employee of:', ['The client organization where the work is performed', 'The staffing agency', 'Neither; they are self-employed', 'Both, jointly and equally'], 1, 'The staffing agency. The client pays the agency; the agency pays the worker.', PS + ' A12 · key'),
    q('flex', 'Which is NOT one of the three reasons given for the rise in use of flexible workers?', ['Economic recessions', 'International competition', 'The shift from manufacturing to a service economy', 'The passage of the Family and Medical Leave Act'], 3, 'The three are recessions, international competition, and the manufacturing-to-service shift.', PS + ' A13 · key'),
    q('flex', 'Regarding benefits for part-time workers, which statement is correct?', ['Employers must offer them health insurance under PPACA', 'Employers must allow them into retirement plans once ERISA age and service requirements are met', 'They are ineligible for COBRA after resignation', 'Retirement is a legally required benefit for all workers'], 1, 'Must allow retirement participation once ERISA thresholds are met. Part-timers aren’t protected under PPACA, can buy COBRA, and retirement is discretionary.', PS + ' A14 · key'),
    q('flex', '“Investment in facilities” and “risk of profit or loss” are factors found in:', ['The common-law test only', 'The economic realities test only', 'Both tests', 'Neither test'], 1, 'Economic realities test only. Those two never appear on the common-law list.', PS + ' A15 · key'),
    q('flex', 'A compressed workweek most commonly takes the form of:', ['Four 10-hour days', 'Five 7-hour days', 'Six 6-hour days', 'Three 8-hour days'], 0, 'Four 10-hour days. Three 12-hour days (36 hours) also appears, but 4×10 is most common.', PS + ' A16 · key'),
    q('exec', 'A company car that the executive’s spouse is also entitled to use is an example of:', ['A benefit', 'A long-term incentive', 'A perquisite', 'A short-term incentive'], 2, 'Perquisite. Perks attach to the position and typically extend to dependents.', PS + ' A18 · key'),
    q('exec', 'The three common financial measures used in executive bonus plans are:', ['Profit, revenue, and cash flow', 'Revenue, headcount, and market share', 'EPS, turnover, and customer satisfaction', 'Profit, compa-ratio, and labor cost'], 0, 'Profit, revenue, cash flow.', PS + ' A19 · key'),
    q('benefits', 'Under a defined contribution plan, investment risk is borne by the ____ and the plan tends to facilitate ____.', ['Employer; retention', 'Employee; retention', 'Employer; mobility', 'Employee; mobility'], 3, 'Employee bears the risk; DC facilitates mobility (portable, faster vesting). DB encourages retention.', PS + ' A20 · key' + TB),
    q('benefits', 'ERISA requires that:', ['Every employer offer a pension plan', 'Pension benefits be fully portable between employers', 'Employees be eligible for pension plans beginning at age 21', 'The PBGC replace 100% of a failed plan’s benefits'], 2, 'Eligibility at age 21. ERISA doesn’t require offering a plan or portability, and PBGC guarantees only a basic benefit.', PS + ' A21 · key' + TB),
    q('benefits', 'FMLA applies to employers with at least ____ employees within a ____ radius and provides up to ____ of leave.', ['20; 50-mile; 18 weeks paid', '50; 75-mile; 12 weeks unpaid', '50; 75-mile; 12 weeks paid', '20; 75-mile; 12 weeks unpaid'], 1, '50 employees, 75-mile radius, 12 weeks unpaid.', PS + ' A22 · key' + TB),
    q('benefits', 'Under COBRA, an employer may charge a former employee up to what percentage of the premium?', ['50%', '100%', '102%', '120%'], 2, '102% (100% premium + 2% administration).', PS + ' A23 · key' + TB),
    q('benefits', 'A health plan that combines HMO and PPO features, letting the person choose which to use at the time of service, is:', ['An indemnity plan', 'A point-of-service plan', 'A health savings account', 'A consumer-driven health plan'], 1, 'Point-of-service (POS) = the HMO/PPO hybrid.', PS + ' A24 · key' + TB),
    q('benefits', 'Workers’ compensation is best described as:', ['A federal no-fault program that preserves the right to sue', 'A state no-fault program under which the covered employee generally cannot sue the employer', 'A discretionary benefit offered by about 47% of employers', 'A federal program financed by employee payroll deductions'], 1, 'State, no-fault, and the covered worker gives up the right to sue.', PS + ' A25 · key' + TB),
    // True / False
    q('compa', 'True or false: A compa-ratio is calculated by dividing actual pay by the minimum of the pay range.', TF, 1, 'False. Divide by the midpoint (or the market rate), never the minimum.', PS + ' B26 · key'),
    q('benefits', 'True or false: Under a noncontributory benefit plan, the employer pays the entire cost.', TF, 0, 'True. Noncontributory means the employee contributes nothing.', PS + ' B27 · key' + TB),
    q('benefits', 'True or false: An employee injured on the job because of his own carelessness is ineligible for workers’ compensation.', TF, 1, 'False. Workers’ comp is no-fault.', PS + ' B28 · key' + TB),
    q('benefits', 'True or false: Unemployment insurance in most states is financed exclusively by employers.', TF, 0, 'True. In most states employers pay it all.', PS + ' B29 · key' + TB),
    q('flex', 'True or false: Part-time employees are considered contingent workers.', TF, 0, 'True. Part-timers are contingent workers.', PS + ' B30 · key'),
    q('benefits', 'True or false: Under a defined benefit plan, the employer’s contribution is defined and the employee bears the investment risk.', TF, 1, 'False. That describes defined contribution. Under DB the benefit is defined and the employer bears the risk.', PS + ' B31 · key' + TB),
    q('benefits', 'True or false: An employee’s own contributions to a pension fund vest immediately and irrevocably.', TF, 0, 'True. Only the employer’s contributions follow a vesting schedule.', PS + ' B32 · key' + TB),
    q('flex', 'True or false: Private organizations are legally required to close on federal holidays.', TF, 1, 'False. That’s exactly why the alternative-paid-time-off rule exists.', PS + ' B33 · key'),
    q('benefits', 'True or false: Coinsurance is a flat dollar amount the employee pays per office visit.', TF, 1, 'False. That’s a copay. Coinsurance is a percentage of the bill after the deductible.', PS + ' B34 · key' + TB),
    q('exec', 'True or false: Bonuses have become a larger portion of executive pay over time.', TF, 1, 'False. Bonuses have become a smaller portion.', PS + ' B35 · key'),
    // Written from the Exam 3 Study Guide
    q('benefits', 'Benefits add roughly how much on top of every $1 of wages and salaries?', ['12 cents', '30 cents', '42 cents', '75 cents'], 2, 'About 42 cents per dollar of wages. 30% is the share of total comp; different denominator.', 'Written from ' + SG + ' 1.1' + TB),
    q('benefits', 'A manager says benefits are cheaper to give than the same amount in cash because of group rates and tax treatment. Which reason for benefit growth is this?', ['Wage and price controls', 'Unions', 'Cost (including tax) effectiveness', 'Government impetus'], 2, '“Tax advantaged / cheaper than cash” → cost and tax effectiveness.', 'Written from ' + SG + ' 1.2' + TB),
    q('benefits', 'Employees rate benefits as important but underestimate what they cost. The course’s fix for that gap is:', ['Add another benefit', 'Better communication (and more employee responsibility)', 'Cut benefits and raise wages', 'Switch to a noncontributory plan'], 1, 'Low perceived value → communication, not another benefit.', 'Written from ' + SG + ' 1.3' + TB),
    q('benefits', 'Judging a benefit by the employee’s financial exposure with vs. without it is which planning objective?', ['Competitiveness', 'Adequacy', 'Cost effectiveness', 'Equity'], 1, 'Adequacy = is the benefit enough to matter to the employee’s exposure.', 'Written from ' + SG + ' 1.4' + TB),
    q('benefits', 'In a cafeteria plan, employees pick the coverage they already know they’ll use, driving up that option’s cost. This is called:', ['Moral hazard', 'Adverse selection', 'Experience rating', 'Cost shifting'], 1, 'Adverse selection is the main downside of flexible (cafeteria) plans, along with administration.', 'Written from ' + SG + ' 1.5' + TB),
    q('benefits', 'Which is an EMPLOYEE factor in deciding what goes into a benefit package?', ['Competitor offerings', 'Legal requirements', 'Personal needs tied to age, marital status, and dependents', 'Relationship to total compensation costs'], 2, 'Employee factors: equity and personal needs. Competitor offerings is an employer factor.', 'Written from ' + SG + ' 1.6' + TB),
    q('benefits', 'Which of these is a LEGALLY REQUIRED benefit?', ['401(k) plan', 'Health insurance', 'Unemployment insurance', 'Paid vacation'], 2, 'Required: workers’ comp, Social Security/Medicare, unemployment insurance. The rest are discretionary.', 'Written from ' + SG + ' Part 2' + TB),
    q('benefits', 'Social Security contributions paid in this year immediately pay this year’s beneficiaries. This funding approach is:', ['Fully funded', 'Pay as you go', 'Defined contribution', 'Experience rated'], 1, 'Pay-as-you-go, which is the core funding problem as workers per retiree falls.', 'Written from ' + SG + ' 2.2' + TB),
    q('benefits', 'A company with heavy layoffs sees its state unemployment tax rate rise. This is due to:', ['Vesting', 'Experience rating', 'Adverse selection', 'COBRA'], 1, 'Experience rating: your rate depends on your own layoff history.', 'Written from ' + SG + ' 2.3' + TB),
    q('benefits', 'Which law limits denying coverage for a preexisting condition and has strict privacy rules?', ['FMLA', 'COBRA', 'HIPAA', 'ERISA'], 2, 'HIPAA (1996) = preexisting conditions + privacy.', 'Written from ' + SG + ' 2.4' + TB),
    q('benefits', '“How long until the company’s match is mine?” is a question about:', ['Portability', 'Vesting', 'Coinsurance', 'Experience rating'], 1, 'Vesting = ownership over time. Portability = moving it to a new employer.', 'Written from ' + SG + ' 2.6' + TB),
    q('benefits', 'A plan that restricts employees to a fixed network of providers in exchange for low cost is a(n):', ['Indemnity plan', 'HMO', 'PPO', 'POS plan'], 1, 'Restricted to network providers only → HMO.', 'Written from ' + SG + ' 2.7' + TB),
    q('benefits', 'Which health account is employee-owned and rolls over year to year?', ['FSA', 'HSA', 'PPO', 'COBRA account'], 1, 'HSA money is yours and rolls over; FSA money is use-it-or-lose-it.', 'Written from ' + SG + ' 2.7' + TB),
    q('compa', 'Pays in a grade are $52,000, $55,000 and $61,000; the midpoint is $58,000. The group compa-ratio is:', ['0.90', '0.97', '1.00', '1.03'], 1, 'Average first: 168,000 ÷ 3 = 56,000. Then 56,000 ÷ 58,000 = 0.97.', 'Written from ' + SG + ' 3.3'),
    q('compa', 'An employee has a compa-ratio of 1.12 in a grade with a $64,000 midpoint. Her pay is:', ['$57,143', '$64,000', '$71,680', '$76,800'], 2, 'Actual pay = CR × midpoint = 1.12 × 64,000 = $71,680.', 'Written from ' + SG + ' 3.3'),
    q('compa', 'Externally, an employee’s compa-ratio is well ABOVE market. The lecture says the organization is likely:', ['Violating FLSA', 'Attracting top talent, but may consider decreasing pay', 'Required to freeze pay', 'Paying below average'], 1, 'Above market: likely attracting top talent; consider decreasing pay depending how far above.', 'Written from ' + SG + ' 3.2'),
    q('payroll', 'Which form does an employee fill out at hire to tell the employer how much income tax to withhold?', ['W-2', 'W-4', '1099', 'I-9'], 1, 'W-4 goes in at hire; W-2 comes out at year end; 1099 is for contractors.', 'Written from ' + SG + ' 4.4'),
    q('payroll', 'On $1,000 of earnings, how much Social Security and Medicare is withheld in total?', ['$62.00', '$14.50', '$76.50', '$153.00'], 2, '$62.00 SS + $14.50 Medicare = $76.50 (7.65%).', 'Written from ' + SG + ' 4.5'),
    q('payroll', 'When calculating Medicare withholding, the 1.45% is taken from:', ['Gross pay', 'Pay left after Social Security', 'Net pay', 'Pay after income tax'], 0, 'Percentages come off gross, never off a running balance.', 'Written from ' + SG + ' 4.6'),
    q('flex', 'A retailer hires three workers for the holidays with a definite stop date. The stop date is what makes them:', ['Exempt', 'Contingent', 'Leased', 'Core employees'], 1, 'No contract for ongoing employment → contingent.', 'Written from ' + SG + ' 5.1'),
    q('flex', 'Two part-timers split one full-time job. Which is NOT one of the four listed effects of job sharing?', ['Reduces costs', 'Increases flexibility', 'Guarantees benefits eligibility', 'May increase loyalty'], 2, 'The four: reduces costs, increases flexibility, maintains productivity, may increase loyalty. Job sharers typically aren’t benefit-eligible.', 'Written from ' + SG + ' 5.3'),
    q('flex', '“Intent” and “method of payment” are factors on which test?', ['Economic realities only', 'Common-law test', 'Both tests', 'FLSA duties test'], 1, 'Intent, tools, supervision, method of payment, type of business, more than one firm → common law only.', 'Written from ' + SG + ' 5.6'),
    q('flex', 'An employee drops her kid off at 8:15, starts at 8:30, leaves at 3:15, and finishes her hours remotely. This is:', ['Compressed workweek', 'Flextime', 'Job sharing', 'Telecommuting only'], 1, 'Working different times of the day = flextime.', 'Written from ' + SG + ' 5.7'),
    q('exec', 'An executive’s base salary is $522,000, the typical 8.7% of the package. The total package is about:', ['$4.5 million', '$5.2 million', '$6.0 million', '$8.7 million'], 2, 'Total = 522,000 ÷ 0.087 = $6,000,000.', 'Written from ' + SG + ' 6.3'),
    q('exec', 'Stock options and stock grants are which executive pay component?', ['Base salary', 'Short-term incentives', 'Long-term incentives', 'Perquisites'], 2, 'Stock options/grants = long-term incentives.', 'Written from ' + SG + ' 6.1'),
    q('exec', 'An executive bonus plan that mixes financial and non-financial measures reflects:', ['A cost-centered approach', 'A balanced scorecard approach', 'Experience rating', 'A defined benefit plan'], 1, 'A balanced scorecard approach is preferred.', 'Written from ' + SG + ' 6.2')
  );

  const fc = (topic, front, back, src, core = true) => ({ id: 'e3c-x' + (++n), topic, front, back, source: src, core });
  flashcards.push(
    fc('benefits', 'Employee benefits (definition)', 'The part of total comp OTHER THAN pay for time worked, paid wholly or partly by the employer (insurance, pension, workers’ comp, vacation).', SG + ' 1.1' + TB),
    fc('benefits', 'Benefits: 30% vs 42%', '30% = share of TOTAL compensation. 42 cents = added per $1 of WAGES. Different denominators.', SG + ' 1.1' + TB),
    fc('benefits', 'Why benefits grew (5)', 'Wage & price controls (WWII/Korea, the original catalyst) · unions · employer impetus · cost/tax effectiveness · government impetus.', SG + ' 1.2' + TB),
    fc('benefits', 'Benefit perception gap', 'Employers spend a lot, employees underestimate the cost and <50% are satisfied. Fix = communication + more employee responsibility.', SG + ' 1.3' + TB),
    fc('benefits', '3 benefit planning objectives', 'Competitiveness (what others offer) · Adequacy (enough to matter?) · Cost effectiveness (cost justified?).', SG + ' 1.4' + TB),
    fc('benefits', '4 benefit administration questions', '1) Who is covered? 2) How much choice? 3) How is it financed? 4) Is it legally defensible?', SG + ' 1.5' + TB),
    fc('benefits', 'Cafeteria (flexible) plan', 'Employees pick from a menu using credits. + fits diverse needs, controls cost. − administration, adverse selection.', SG + ' 1.5' + TB),
    fc('benefits', 'Noncontributory / contributory / employee-financed', 'Noncontributory = employer pays 100%. Contributory = shared. Employee-financed = employee pays.', SG + ' 1.5' + TB),
    fc('benefits', 'Employer vs employee factors', 'Employer: cost relationship, cost vs benefit, competitor offerings, attraction/retention role, legal. Employee: equity, personal needs (age, sex, marital status, dependents).', SG + ' 1.6' + TB),
    fc('benefits', 'Legally required benefits (3)', 'Workers’ compensation · Social Security/Medicare · Unemployment insurance. Everything else is discretionary.', SG + ' Part 2' + TB),
    fc('benefits', 'Workers’ compensation', 'State, no-fault insurance for job injury/illness. Eligible even if careless; in exchange can’t sue. Covers medical, temp & perm disability, death, rehab.', SG + ' 2.1' + TB),
    fc('benefits', 'Workers’ comp formula', 'Weekly benefit = 2/3 × pre-injury weekly wage × % disability (capped by a state max).', SG + ' 2.1' + TB),
    fc('benefits', 'Social Security (OASDI)', 'Act of 1935. Old Age, Survivors, Disability Insurance. Pay-as-you-go. Medicare added 1965; COLA tied to CPI 1972.', SG + ' 2.2' + TB),
    fc('benefits', 'Unemployment insurance', 'Social Security Act 1935 (Wisconsin first, 1932). Employer-financed. FUTA = 0.6% of first $7,000. Experience rating sets the state rate.', SG + ' 2.3' + TB),
    fc('benefits', 'FMLA', '1993. 50+ employees within 75 miles. Up to 12 weeks UNPAID leave; same/comparable job on return.', SG + ' 2.4' + TB),
    fc('benefits', 'COBRA', '1985. 20+ employees. Continue group health after a qualifying event at up to 102% of premium, 18 months (up to 36). Ex-employee pays.', SG + ' 2.4' + TB),
    fc('benefits', 'HIPAA', '1996. Limits preexisting-condition denials, bans health-status discrimination, strict privacy (2002).', SG + ' 2.4' + TB),
    fc('benefits', 'PPACA / ACA', '2010. Employer mandate still in force; individual mandate eliminated 2018. Part-timers not protected.', SG + ' 2.4' + TB),
    fc('benefits', 'Defined benefit vs defined contribution', 'DB: benefit is defined, EMPLOYER bears risk, encourages retention. DC (401k): contribution is defined, EMPLOYEE bears risk, portable/mobility.', SG + ' 2.5' + TB),
    fc('benefits', 'ERISA', '1974. Doesn’t require a pension, but controls one if offered. Eligibility at age 21. Vesting required; portability NOT required. Created PBGC.', SG + ' 2.6' + TB),
    fc('benefits', 'Vesting schedules', 'Full after 3 years, OR 20% after 2 years + 20%/yr (full at 6). Own contributions vest immediately.', SG + ' 2.6' + TB),
    fc('benefits', 'PBGC', 'Pension Benefit Guaranty Corporation. Guarantees a basic benefit if a plan fails (not full). Funded by employer premiums.', SG + ' 2.6' + TB),
    fc('benefits', 'HMO / PPO / POS / Indemnity', 'Indemnity = any provider, priciest. HMO = network only, cheapest. PPO = can go out of network for more. POS = HMO/PPO hybrid.', SG + ' 2.7' + TB),
    fc('benefits', 'Deductible · copay · coinsurance', 'Deductible = paid before the plan pays. Copay = flat $ per visit. Coinsurance = % of the bill after deductible.', SG + ' 2.7' + TB),
    fc('benefits', 'HSA vs FSA', 'HSA = employee-owned, rolls over (with a high-deductible plan). FSA = use it or lose it.', SG + ' 2.7' + TB),
    fc('compa', 'Compa-ratio formulas', 'Internal: pay ÷ range midpoint. External: pay ÷ market rate. <1 below · 1 at · >1 above average.', SG + ' 3.1'),
    fc('compa', 'Group compa-ratio', 'Average all pays in the grade first, then ÷ midpoint once.', SG + ' 3.3'),
    fc('compa', 'Working backward', 'Actual pay = CR × midpoint. Raise to reach 1.00 = midpoint − current pay.', SG + ' 3.3'),
    fc('compa', 'High vs low compa-ratio fixes', 'Internal low → raise to policy. Internal high → freeze (tenure caveat). External low → consider raising. External high → attracting talent, may decrease.', SG + ' 3.2'),
    fc('payroll', 'Payroll components', 'Gross pay · deductions (taxes, insurance, retirement, garnishments) · net pay · overtime & bonuses · leave payouts.', SG + ' 4.2'),
    fc('payroll', '6 payroll steps', 'Time collection → approval & entry → calculations → review & audit → disbursement → reporting.', SG + ' 4.3'),
    fc('payroll', 'W-4 · W-2 · 1099', 'W-4 = withholding choice at hire. W-2 = annual wage/tax statement. 1099 = independent contractor.', SG + ' 4.4'),
    fc('payroll', 'Who pays which payroll tax', 'Employee: federal & state income tax, their FICA. Employer: matching FICA + FUTA & SUTA.', SG + ' 4.5'),
    fc('payroll', 'Net pay formula', 'Net = Gross − SS (6.2%) − Medicare (1.45%) − income tax withheld − other deductions. % off GROSS.', SG + ' 4.6'),
    fc('payroll', 'Payroll mistakes & best practices', 'Mistakes: W-2 vs 1099 misclassification, wrong tax calc, late filing, poor documentation, manual errors. Best: automate, audit, stay current, communicate.', SG + ' 4.7'),
    fc('flex', 'Contingent worker', 'No implicit/explicit contract for ongoing employment. Part-timers count. Leaving for school/retirement does NOT count.', SG + ' 5.1'),
    fc('flex', '4 types of flexible workers', 'Part-time · temporary & on-call · leased · independent contractors/freelancers/consultants.', SG + ' 5.2'),
    fc('flex', 'Leasing cost', '(Hourly rate × hours) × 1.25 when the agency fee is 25%. Agency is the legal employer and issues the W-2.', SG + ' 5.2'),
    fc('flex', 'Job sharing', 'Two+ part-timers do one job. Reduces costs, increases flexibility, maintains productivity, may increase loyalty.', SG + ' 5.3'),
    fc('flex', 'Why flexible workers are rising', 'Economic recessions · international competition (offshoring) · shift from manufacturing to service.', SG + ' 5.4'),
    fc('flex', 'Common-law vs economic realities', 'Common law (10): control, business type, supervision, skill, tools, relationship, payment, integration, intent, >1 firm. Economic realities only: investment, risk.', SG + ' 5.6'),
    fc('flex', 'Flextime · compressed · telecommuting', 'Flextime = different times of day. Compressed = fewer days, ~40 hrs (4×10). Telecommuting = home/road.', SG + ' 5.7'),
    fc('flex', 'Holidays for flexible staff', 'If they work a holiday, alternative paid time off is required. Private orgs don’t have to close on federal holidays.', SG + ' 5.8'),
    fc('exec', '5 executive pay components', 'Base salary · short-term bonus · long-term incentives (stock) · benefits · perquisites.', SG + ' 6.1'),
    fc('exec', 'Base salary share', 'Just 8.7% of exec total comp. Total = base ÷ 0.087.', SG + ' 6.1'),
    fc('exec', 'Perquisites vs benefits', 'Perks = privileges from the position, often extend to family (company car). Benefits = insurance/retirement package.', SG + ' 6.1'),
    fc('exec', 'Executive bonus plans', 'Nearly every exec has one. Measures: profit, revenue, cash flow. Shrinking share of pay. Balanced scorecard preferred.', SG + ' 6.2')
  );

  const cu = (topic, clue, answer, src) => ({ id: 'e3q-x' + (++n), topic, clue, answer, source: src });
  cues.push(
    cu('benefits', '“other than pay for time worked”', 'definition of employee benefits', SG + ' 1.1'),
    cu('benefits', '“employers couldn’t raise wages during the war”', 'wage and price controls', SG + ' 1.2'),
    cu('benefits', '“cheaper to give than cash” / “tax advantaged”', 'cost and tax effectiveness', SG + ' 1.2'),
    cu('benefits', '“employees underestimate what benefits cost”', 'cost vs perceived-value gap → communicate', SG + ' 1.3'),
    cu('benefits', '“enough to cover the employee’s exposure”', 'adequacy', SG + ' 1.4'),
    cu('benefits', '“menu” / “credits” / “employees choose”', 'flexible (cafeteria) plan', SG + ' 1.5'),
    cu('benefits', '“employer and employee split the premium”', 'contributory financing', SG + ' 1.5'),
    cu('benefits', '“age, dependents, marital status”', 'employee factor', SG + ' 1.6'),
    cu('benefits', '“even though the employee was careless”', 'workers’ comp is no-fault, still covered', SG + ' 2.1'),
    cu('benefits', '“today’s contributions pay today’s retirees”', 'pay-as-you-go (Social Security)', SG + ' 2.2'),
    cu('benefits', '“lays off a lot, so its rate went up”', 'experience rating', SG + ' 2.3'),
    cu('benefits', '“12 weeks unpaid”', 'FMLA', SG + ' 2.4'),
    cu('benefits', '“102% of the premium”', 'COBRA', SG + ' 2.4'),
    cu('benefits', '“preexisting condition” / “privacy”', 'HIPAA', SG + ' 2.4'),
    cu('benefits', '“promises a specific monthly amount at retirement”', 'defined benefit', SG + ' 2.5'),
    cu('benefits', '“balance depends on market returns”', 'defined contribution', SG + ' 2.5'),
    cu('benefits', '“can I move it to my next job?”', 'portability (not required by ERISA)', SG + ' 2.6'),
    cu('benefits', '“hybrid of HMO and PPO”', 'point-of-service (POS)', SG + ' 2.7'),
    cu('benefits', '“percentage of the bill”', 'coinsurance (not copay)', SG + ' 2.7'),
    cu('compa', '“relative to what other companies pay”', 'external / market compa-ratio', SG + ' 3.1'),
    cu('payroll', '“right before disbursement”', 'review & audit', SG + ' 4.3'),
    cu('payroll', '“total payroll taxes” (no income tax named)', '7.65% FICA', SG + ' 4.5'),
    cu('payroll', '“taxes the employer pays that the employee doesn’t”', 'FUTA and SUTA', SG + ' 4.5'),
    cu('flex', '“employed by the agency, not by us”', 'leased employee', SG + ' 5.2'),
    cu('flex', '“invested in their own equipment” / “profit or loss”', 'economic realities test', SG + ' 5.6'),
    cu('flex', '“intent” / “method of payment”', 'common-law test', SG + ' 5.6'),
    cu('exec', '“8.7%”', 'base salary’s share of exec pay', SG + ' 6.1'),
    cu('exec', '“company car, extends to the family”', 'perquisite', SG + ' 6.1'),
    cu('exec', '“profit, revenue, cash flow”', 'the three bonus measures', SG + ' 6.2')
  );

  const $f = (id, label, answer, unit = '$', tolerance = 0.01) => ({ id, label, answer, unit, tolerance });
  math.push(
    { id: 'e3m-w1', title: 'W1 · Brightline compa-ratios (÷ 62,000)', topic: 'compa', type: 'compa', source: PS + ' W1 · key', origin: 'notes',
      prompt: 'Grade 4 has a $62,000 midpoint. Five incumbents are paid as shown. Find the first three compa-ratios, the group compa-ratio, and the raise that brings the lowest-paid employee to 1.00.',
      table: { headers: ['Employee', 'Pay'], rows: [['1', 58900], ['2', 71400], ['3', 46500], ['4', 63700], ['5', 60100]] },
      fields: [$f('c1', 'Employee 1 compa-ratio', 0.95, '', 0.005), $f('c2', 'Employee 2 compa-ratio', 1.15, '', 0.005), $f('c3', 'Employee 3 compa-ratio', 0.75, '', 0.005), $f('grp', 'Group compa-ratio', 0.97, '', 0.005), $f('raise', 'Raise for lowest-paid to reach 1.00', 15500)],
      steps: ['58,900 ÷ 62,000 = 0.95 · 71,400 ÷ 62,000 = 1.15 · 46,500 ÷ 62,000 = 0.75.', 'Sum = 300,600; average = 60,120; group CR = 60,120 ÷ 62,000 = 0.97.', '0.75 sits on the bottom edge → raise toward policy. No one is above 1.25, so no freeze.', 'Raise = 62,000 − 46,500 = $15,500.'] },
    { id: 'e3m-w2', title: 'W2 · Marcus net pay', topic: 'payroll', type: 'netpay', source: PS + ' W2 · key', origin: 'notes',
      prompt: 'Marcus earns $3,200/month gross. Withheld: $412 federal income tax (W-4), $125 health insurance, $80 401(k). Find SS, Medicare, net pay, the amount sent to the federal government, and the employer’s own FICA cost.',
      fields: [$f('ss', 'Social Security', 198.4), $f('med', 'Medicare', 46.4), $f('net', 'Net pay', 2338.2), $f('fed', 'Sent to federal government', 656.8), $f('er', 'Employer’s FICA match', 244.8)],
      steps: ['SS = 3,200 × 6.2% = 198.40; Medicare = 3,200 × 1.45% = 46.40.', 'Net = 3,200 − 198.40 − 46.40 − 412 − 125 − 80 = 2,338.20.', 'Federal = 198.40 + 46.40 + 412 = 656.80 (insurance and 401(k) aren’t federal).', 'Employer match = 198.40 + 46.40 = 244.80.'] },
    { id: 'e3m-w3', title: 'W3 · Tasha overtime + net pay', topic: 'payroll', type: 'overtime', source: PS + ' W3 · key', origin: 'notes',
      prompt: 'Tasha is non-exempt at $24.00/hour and worked 46 hours (overtime 1.5× over 40). Income tax withheld is $188 and other deductions are $60. Find gross, SS, Medicare, and net pay.',
      fields: [$f('gross', 'Gross pay', 1176), $f('ss', 'Social Security', 72.91), $f('med', 'Medicare', 17.05), $f('net', 'Net pay', 838.04)],
      steps: ['Regular = 40 × 24 = 960; overtime = 6 × 24 × 1.5 = 216; gross = 1,176.', 'SS = 1,176 × 6.2% = 72.91; Medicare = 1,176 × 1.45% = 17.05.', 'Net = 1,176 − 72.91 − 17.05 − 188 − 60 = 838.04.'] },
    { id: 'e3m-w4', title: 'W4 · Executive package', topic: 'exec', type: 'exec', source: PS + ' W4 · key', origin: 'notes',
      prompt: '(a) Base $435,000 is 8.7% of the package; find the total. (b) Base $720,000; bonus $60,000 per QUARTER; LTI $6,000,000; benefits $480,000; perks $360,000. Find the total, base %, and incentives % (short + long).',
      fields: [$f('a', '(a) Total package', 5000000, '$', 1), $f('tot', '(b) Total compensation', 7800000, '$', 1), $f('base', '(b) Base salary %', 9.23, '%', 0.01), $f('inc', '(b) Incentives %', 80, '%', 0.01)],
      steps: ['(a) 435,000 ÷ 0.087 = 5,000,000.', '(b) Annualize bonus: 60,000 × 4 = 240,000.', 'Total = 720,000 + 240,000 + 6,000,000 + 480,000 + 360,000 = 7,800,000.', 'Base % = 720,000 ÷ 7,800,000 = 9.23%. Incentives = 6,240,000 ÷ 7,800,000 = 80.00%.'] },
    { id: 'e3m-w5', title: 'W5 · Workers’ comp weekly benefit', topic: 'benefits', type: 'workcomp', source: PS + ' W5 · key' + TB, origin: 'notes',
      prompt: 'A New York claimant earned $1,150/week before the injury. Weekly benefit = 2/3 × weekly wage × % disability (state max $966.78). Find the benefit at 100% and at 40% disability.',
      fields: [$f('full', 'Weekly benefit at 100%', 766.67), $f('part', 'Weekly benefit at 40%', 306.67)],
      steps: ['2/3 × 1,150 × 1.00 = 766.67.', '2/3 × 1,150 × 0.40 = 306.67.', 'Both are under the $966.78 cap, so the cap doesn’t change either.'] },
    { id: 'e3m-w6', title: 'W6 · FUTA + leased labor', topic: 'flex', type: 'lease', source: PS + ' W6 · key', origin: 'notes',
      prompt: '(a) FUTA is 0.6% of the first $7,000. Find FUTA per worker. (b) A leased operator costs $21.50/hour for 38 hours plus a 25% agency fee. What does the client pay the agency?',
      fields: [$f('futa', '(a) FUTA per worker', 42), $f('lease', '(b) Paid to the agency', 1021.25)],
      steps: ['FUTA = 0.006 × 7,000 = 42.00.', 'Base = 21.50 × 38 = 817.00; fee = 204.25; total = 1,021.25 (= 817 × 1.25).', 'The agency issues the W-2, because it is the legal employer.'] }
  );

  /* ---- 10/3 Payroll Update (Canvas Resources: Fed & State Tax Rates page, Payroll Deduction Flowchart, 2025 Fed W-4, 2025 IL W-4) ----
     Own id prefix (e3p-) so adding these never shifts the ids of earlier items. */
  const PU = 'Payroll Update (10/3)', CT = 'Canvas tax table', FL = 'Canvas payroll flowchart', W4 = '2025 W-4 / IL-W-4';
  let pn = 0;
  const pq = (prompt, options, answer, explanation, source) => ({ id: 'e3p-q' + (++pn), topic: 'payroll', prompt, options, answer, answerKeyText: options[answer], explanation, source });
  const pc = (front, back, source, core = true) => ({ id: 'e3p-c' + (++pn), topic: 'payroll', front, back, source, core });
  const pk = (clue, answer, source) => ({ id: 'e3p-k' + (++pn), topic: 'payroll', clue, answer, source });
  questions.push(
    pq('In the payroll deduction flow, what is taken out FIRST after gross pay?', ['Taxes', 'Before-tax deductions', 'After-tax deductions', 'Garnishments'], 1, 'Gross → before-tax deductions → taxes → after-tax deductions → net pay.', 'Written from ' + FL),
    pq('A Roth 401(k) contribution is a(n):', ['Before-tax deduction', 'After-tax deduction', 'Employer-paid tax', 'Part of gross pay'], 1, 'Roth = after-tax, so it doesn’t lower taxes. A plain 401(k) is before-tax. Same account family, opposite layer.', 'Written from ' + FL),
    pq('Which of these is a BEFORE-tax deduction on the flowchart?', ['Union dues', 'Wage garnishment', 'HSA contribution', 'Charitable giving'], 2, 'Before-tax: health insurance, 401(k)/HSA/FSA, commuter benefits. Dues, garnishments and charity are after-tax.', 'Written from ' + FL),
    pq('Which of these is an AFTER-tax deduction?', ['Health insurance premium', 'Traditional 401(k)', 'Commuter benefits', 'Union dues'], 3, 'After-tax: Roth 401(k), union dues, garnishments, charity.', 'Written from ' + FL),
    pq('Why does a before-tax deduction save the employee money?', ['It is paid by the employer', 'It lowers taxable income, so less income tax is withheld', 'It is refunded at year end', 'It skips Social Security'], 1, 'Before-tax deductions come out before income tax is figured, shrinking taxable pay. (In the prof’s method FICA still comes off gross.)', 'Written from ' + PU),
    pq('The U.S. federal income tax is:', ['Flat: one rate on all income', 'Progressive and marginal: each slice is taxed at its own rate', 'A fixed 4.95%', 'Paid only by the employer'], 1, 'Each slice of taxable income is taxed at its bracket’s rate. You never apply one rate to the whole amount.', 'Written from ' + CT),
    pq('Taxable income is $40,000 (single, 2025). Federal income tax is:', ['$4,000', '$4,562', '$4,800', '$8,800'], 1, '12% bracket: 1,193 + 0.12 × (40,000 − 11,925) = 1,193 + 3,369 = $4,562.', 'Written from ' + CT + ' · guide example A'),
    pq('Taxable income is $49,000. Federal income tax is:', ['$10,780.00', '$5,880.00', '$5,694.50', '$4,900.00'], 2, '22% bracket: 5,579 + 0.22 × (49,000 − 48,475) = 5,579 + 115.50 = $5,694.50. 22% × 49,000 = $10,780 is the trap.', 'Written from ' + CT + ' · guide example B'),
    pq('Someone with $60,000 of taxable income has a MARGINAL tax rate of:', ['10%', '12%', '22%', '24%'], 2, '$60,000 lands in the $48,476–$103,350 bracket, so the last dollar is taxed at 22%.', 'Written from ' + CT),
    pq('Compared with the marginal rate, the EFFECTIVE tax rate (total tax ÷ taxable income) is:', ['Always higher', 'Always lower (or equal in the first bracket)', 'Always the same', 'Unrelated'], 1, 'Lower slices are taxed at lower rates, so the average comes out below the top rate. $40,000 → $4,562 = 11.4% vs a 12% marginal rate.', 'Written from ' + PU),
    pq('What is Illinois’s state income tax rate?', ['3.00% with brackets', '4.95% flat', '6.20%', '7.65%'], 1, 'Canvas: Illinois has a fixed income tax rate of 4.95%. No brackets.', CT),
    pq('A question describes a tax as “fixed” or “one rate.” Which tax is it?', ['Federal income tax', 'Illinois income tax', 'FUTA', 'Medicare'], 1, '“Flat/fixed” → Illinois. “Progressive/brackets” → federal.', 'Written from ' + PU),
    pq('Monthly taxable pay is $3,650. Illinois income tax withheld is:', ['$108.04', '$180.68', '$226.30', '$279.23'], 1, '4.95% × 3,650 = $180.68.', 'Written from ' + PU + ' 4.11'),
    pq('Before using the bracket table on a bi-weekly paycheck, you multiply by:', ['12', '24', '26', '52'], 2, 'Annualize: monthly ×12 · semi-monthly ×24 · bi-weekly ×26 · weekly ×52. Then divide the annual tax back down.', 'Written from ' + PU),
    pq('Monthly gross $4,000; before-tax $350; Roth $100; single, Illinois. Net pay (prof’s method, FICA off gross) is:', ['$2,645.15', '$2,745.15', '$2,951.15', '$3,034.00'], 0, 'FICA 248 + 58; fed 5,018/12 = 418.17; IL 180.68. 4,000 − 350 − 306 − 418.17 − 180.68 − 100 = $2,645.15.', 'Written from ' + PU + ' 4.11'),
    pq('If a payroll problem GIVES you the income tax withheld, you should:', ['Recompute it from the bracket table', 'Subtract the given amount as is', 'Apply 4.95% instead', 'Ignore it'], 1, 'Given a withholding number → just subtract it. Only use the brackets when you have to compute it yourself.', 'Written from ' + PU),
    pq('Where does an employee’s completed Form W-4 go?', ['To the IRS', 'To the employer', 'To the state', 'To the Social Security Administration'], 1, 'The form says “Give Form W-4 to your employer.” It tells the employer how much to withhold.', W4),
    pq('An employee wants an extra $25 withheld from every paycheck. Which part of the federal W-4?', ['Step 1', 'Step 2', 'Step 3', 'Step 4(c)'], 3, 'Step 4(c) = extra withholding each pay period.', W4),
    pq('On the 2025 W-4, Step 3 (Claim Dependents) gives:', ['$500 per child under 17', '$2,000 per qualifying child under 17 and $500 per other dependent', '$1,000 per dependent', 'One allowance per dependent'], 1, '$2,000 × qualifying children under 17 + $500 × other dependents (income $200k or less; $400k MFJ).', W4),
    pq('An employee has two jobs. Which W-4 step applies?', ['Step 2: Multiple Jobs or Spouse Works', 'Step 3: Claim Dependents', 'Step 4(b): Deductions', 'Step 5: Sign'], 0, 'Step 2 covers more than one job or a working spouse (estimator, worksheet → 4(c), or the two-jobs checkbox).', W4),
    pq('Which statement about allowances is TRUE?', ['The federal W-4 still uses allowances', 'The IL-W-4 uses allowances; more allowances = less tax withheld', 'More allowances = more tax withheld', 'Neither form uses allowances'], 1, 'Federal dropped allowances in the 2020 redesign. The Illinois IL-W-4 still uses them.', W4),
    pq('An employee claims exempt on the federal W-4. They:', ['Leave the form blank', 'Write “Exempt” under Step 4(c) and complete only Steps 1(a), 1(b) and 5', 'Check a box in Step 3', 'Send it to the IRS'], 1, 'Exempt is allowed only if they owed no tax last year and expect to owe none.', W4),
    pq('The W-4 determines:', ['The final tax the employee owes', 'How much is withheld from each paycheck', 'The employer’s FUTA rate', 'The employee’s gross pay'], 1, 'W-4 sets withholding, not the final tax. The difference settles when they file.', 'Written from ' + PU)
  );
  flashcards.push(
    pc('Payroll deduction flow', 'Gross → BEFORE-tax deductions → TAXES (fed, SS, Medicare, state) → AFTER-tax deductions → NET pay.', FL),
    pc('Before-tax deductions', 'Health insurance · 401(k) / HSA / FSA · commuter benefits. They lower taxable income.', FL),
    pc('After-tax deductions', 'Roth 401(k) · union dues · garnishments · charity. They don’t lower taxes.', FL),
    pc('Roth vs traditional 401(k)', 'Traditional = before-tax. Roth = after-tax. Same account family, opposite layer.', PU),
    pc('2025 federal brackets (single)', '10% to 11,925 · 12% to 48,475 · 22% to 103,350 · 24% to 197,300 · 32% to 250,525 · 35% to 626,350 · 37% above.', CT),
    pc('Bracket bases', '1,193 (12%) · 5,579 (22%) · 17,651 (24%) · 40,199 (32%) · 57,231 (35%) · 188,770 (37%).', CT),
    pc('Federal tax steps', '1 Annualize · 2 subtract before-tax → taxable · 3 tax = base + rate × (taxable − floor) · 4 ÷ pay periods.', PU),
    pc('Annualizing', 'Monthly ×12 · semi-monthly ×24 · bi-weekly ×26 · weekly ×52.', PU),
    pc('Marginal vs effective rate', 'Marginal = rate on the last dollar (your bracket). Effective = total tax ÷ taxable income (lower).', PU),
    pc('Illinois income tax', 'Flat 4.95% of taxable pay. No brackets.', CT),
    pc('Federal W-4 steps', '1 personal info + filing status · 2 multiple jobs / spouse works · 3 dependents ($2,000/child <17, $500 other) · 4 other income, deductions, (c) extra withholding · 5 sign.', W4),
    pc('IL-W-4 lines', 'Line 1 basic allowances · Line 2 additional allowances (65+, blind, deductions ÷ 1,000) · Line 3 extra $ per paycheck · Exempt box.', W4),
    pc('Allowances trap', 'Federal W-4: no allowances since 2020. IL-W-4: yes, and more allowances = less withheld.', W4),
    pc('Given vs computed tax', 'Given a withholding number → subtract it. Only compute from brackets when none is given. FICA comes off gross in the prof’s method.', PU)
  );
  cues.push(
    pk('“Roth,” “union dues,” “garnishment,” “charity”', 'after-tax deduction', FL),
    pk('“401(k), HSA, FSA, health premium, commuter”', 'before-tax deduction', FL),
    pk('“flat,” “fixed,” “one rate”', 'Illinois 4.95%', CT),
    pk('“progressive,” “brackets”', 'federal income tax', CT),
    pk('“rate on the last dollar”', 'marginal rate', PU),
    pk('“extra withholding each paycheck”', 'W-4 Step 4(c) / IL-W-4 Line 3', W4),
    pk('“two jobs” / “working spouse”', 'W-4 Step 2', W4),
    pk('“dependents” / “child credit”', 'W-4 Step 3', W4),
    pk('“allowances”', 'IL-W-4 only (federal dropped them)', W4)
  );
  math.push(
    { id: 'e3m-pu1', title: 'Payroll Update · Federal tax from brackets', topic: 'payroll', type: 'fedtax', source: PU + ' 4.9 examples', origin: 'notes',
      prompt: 'Using the 2025 single brackets, find the federal income tax on (a) $40,000 of taxable income and (b) $49,000 of taxable income. Then (c) the effective rate for (a), as a %.',
      fields: [$f('a', '(a) Tax on $40,000', 4562), $f('b', '(b) Tax on $49,000', 5694.5), $f('eff', '(c) Effective rate for (a)', 11.4, '%', 0.05)],
      steps: ['(a) 12% bracket: 1,193 + 0.12 × (40,000 − 11,925) = 1,193 + 3,369 = 4,562.', '(b) 22% bracket: 5,579 + 0.22 × (49,000 − 48,475) = 5,579 + 115.50 = 5,694.50. Not 22% × 49,000.', '(c) 4,562 ÷ 40,000 = 11.4% (below the 12% marginal rate).'] },
    { id: 'e3m-pu2', title: 'Payroll Update · Net pay with computed taxes', topic: 'payroll', type: 'paytax', source: PU + ' 4.11', origin: 'notes',
      prompt: 'Monthly gross $4,000. Before-tax: $200 401(k) + $150 health premium. After-tax: $100 Roth. Single, Illinois. Find SS, Medicare, monthly federal tax, Illinois tax, and net pay.',
      fields: [$f('ss', 'Social Security', 248), $f('med', 'Medicare', 58), $f('fed', 'Federal income tax (monthly)', 418.17), $f('il', 'Illinois tax', 180.68), $f('net', 'Net pay', 2645.15)],
      steps: ['Taxable = 4,000 − 350 = 3,650/mo → × 12 = 43,800/yr.', 'SS = 6.2% × 4,000 = 248; Medicare = 1.45% × 4,000 = 58 (off gross).', 'Fed = 1,193 + 0.12 × (43,800 − 11,925) = 5,018/yr ÷ 12 = 418.17.', 'IL = 4.95% × 3,650 = 180.68.', 'Net = 4,000 − 350 − 248 − 58 − 418.17 − 180.68 − 100 = 2,645.15.'] }
  );

  /* ---- Guest speaker Kathleen Hermacinski (Landmark Community Center), Wed 9/23 — from Wesley's class notes.
     Own id prefix (e3k-). Notes said "FMLA 12 weeks paid" and "ACA $99.60": the game keeps the course/legal facts
     (FMLA is UNPAID; ACA affordability for 2026 is 9.96% of household income). */
  const KH = 'Guest speaker Kathleen Hermacinski (9/23)';
  let kn = 0;
  const kq = (prompt, options, answer, explanation) => ({ id: 'e3k-q' + (++kn), topic: 'benefits', prompt, options, answer, answerKeyText: options[answer], explanation, source: KH });
  const kc = (front, back) => ({ id: 'e3k-c' + (++kn), topic: 'benefits', front, back, source: KH, core: true });
  const kk = (clue, answer) => ({ id: 'e3k-k' + (++kn), topic: 'benefits', clue, answer, source: KH });
  questions.push(
    kq('Kathleen described four ways benefits shape an organization. Which is NOT one of them?', ['Total compensation', 'Risk allocation', 'Compliance', 'Stock price'], 3, 'Benefits shape: 1 total compensation · 2 risk allocation · 3 compliance · 4 talent.'),
    kq('Kathleen defined a “benefit” as:', ['Any cash paid in a paycheck', 'An advantage or value gained from something', 'A tax the employer must pay', 'A bonus tied to performance'], 1, 'Benefit = an advantage or value gained from something (healthcare, paid time off, etc.).'),
    kq('Who pays for workers’ compensation coverage?', ['The employee, through payroll deductions', 'The employer; premiums are NOT deducted from the employee’s pay', 'Split 50/50', 'The federal government'], 1, 'Workers’ comp is employer funded. Premiums are not taken out of paychecks.'),
    kq('An employee cuts a finger on a fan at work. What should happen first under workers’ comp?', ['Nothing; it’s the employee’s fault', 'Document and report the injury', 'The employee sues the employer', 'The employee files under COBRA'], 1, 'Workers’ comp covers work injuries. The first step is to document and report the injury. (It’s no-fault, so blame doesn’t matter.)'),
    kq('A 1099 independent contractor is hurt while working on a job for a company. Generally:', ['The company’s workers’ comp covers them', 'They fall outside the employer’s workers’ comp; the company isn’t responsible', 'COBRA covers them', 'FMLA covers them'], 1, '1099 = doesn’t work FOR the employer, just on the job. Contractors generally fall outside employee workers’ comp.'),
    kq('True or false: Self-funded health plans eliminate all of the employer’s risk.', ['True', 'False'], 1, 'False. In a self-funded plan the employer pays claims itself, so it carries MORE claims risk, not none.'),
    kq('Which of these did Kathleen list as a fringe benefit?', ['Base salary', 'Overtime pay', 'Pet insurance', 'FICA'], 2, 'Fringe benefits: vision, memberships, catered meals, snacks, pet insurance, EAP (mental health).'),
    kq('An EAP (Employee Assistance Program) mainly offers:', ['Retirement matching', 'Mental health and personal support', 'Extra vacation days', 'Stock options'], 1, 'EAP = mental health support, listed as a fringe benefit.'),
    kq('The ACA employer mandate applies to employers with at least:', ['20 employees', '50 full-time equivalent employees', '100 employees', '15 employees'], 1, 'ACA = 50+ full-time equivalents (an “applicable large employer”).'),
    kq('Under the ACA, an employer’s coverage counts as “affordable” in 2026 if the employee’s cost for self-only coverage is no more than:', ['7.65% of income', '9.96% of household income', '4.95% of income', '$99.60 per year'], 1, '2026 affordability = 9.96%. Employers use IRS “safe harbors” (W-2 wages, rate of pay, or federal poverty line) to prove it.'),
    kq('Under FMLA, an eligible employee can take up to 12 weeks of leave that is:', ['Paid at full salary', 'Unpaid, but the job is protected', 'Paid at 2/3 salary', 'Only for the employee’s own illness'], 1, 'FMLA leave is UNPAID with job protection. (Easy to mis-hear as “paid”; the exam wants unpaid.)'),
    kq('COBRA lets a worker:', ['Get free insurance for life', 'Keep group health insurance after a qualifying loss of coverage (they pay)', 'Take 12 weeks of leave', 'Avoid FICA'], 1, 'COBRA = continue insurance after a qualifying event (job loss, cut hours). The person pays, up to 102%.'),
    kq('Which account is tied to a HIGH-DEDUCTIBLE health plan?', ['FSA', 'HSA', 'DC FSA', 'EAP'], 1, 'HSA = Health Savings Account, paired with a high-deductible plan. The money rolls over.'),
    kq('A DC FSA (Dependent Care FSA) is used for:', ['Doctor copays', 'Day care for dependents', 'Retirement', 'Dental cleanings'], 1, 'Dependent Care Flexible Spending Account: optional, pays for day care with pre-tax money.'),
    kq('FICA stands for:', ['Federal Income Compensation Act', 'Federal Insurance Contributions Act', 'Fair Income Credit Account', 'Federal Insurance Coverage Allowance'], 1, 'FICA = Federal Insurance Contributions Act: Social Security 6.2% + Medicare 1.45%.')
  );
  flashcards.push(
    kc('Benefit (Kathleen)', 'An advantage or value gained from something. Examples: healthcare, paid time off.'),
    kc('How benefits shape the org (4)', '1 Total compensation · 2 Risk allocation · 3 Compliance · 4 Talent.'),
    kc('Workers’ comp: who pays?', 'Employer funded. Premiums are NOT deducted from the employee’s pay. Covers work injuries (cut finger on a fan). First step: document and report.'),
    kc('1099 contractor + workers’ comp', 'Works on the job, not for the employer. Generally outside employee workers’ comp; employer not responsible.'),
    kc('Fringe benefits (Kathleen’s list)', 'Vision · memberships · catered meals · snacks · pet insurance · EAP (mental health).'),
    kc('Self-funded plans', 'Do NOT eliminate all risk (false). The employer pays claims itself, so it carries the claims risk.'),
    kc('ACA', 'Affordable Care Act: applies at 50+ full-time equivalents. Safe harbors prove coverage is affordable. 2026 affordability = 9.96% of household income.'),
    kc('FMLA vs COBRA', 'FMLA: 12 weeks UNPAID, job-protected leave. COBRA: keep group insurance after a qualifying loss; the person pays.'),
    kc('FSA vs HSA vs DC FSA', 'FSA: flexible spending, use it or lose it. HSA: high-deductible plan, rolls over. DC FSA: dependent care (day care), optional.'),
    kc('FICA', 'Federal Insurance Contributions Act = Social Security 6.2% + Medicare 1.45%.')
  );
  cues.push(
    kk('“premiums not deducted from pay” / “cut finger at work”', 'workers’ compensation (employer funded)'),
    kk('“1099” / “works on the job, not for the employer”', 'contractor: outside workers’ comp'),
    kk('“EAP,” “pet insurance,” “catered meals,” “snacks”', 'fringe benefits'),
    kk('“50 full-time equivalents,” “safe harbor,” “affordability”', 'ACA'),
    kk('“high deductible”', 'HSA'),
    kk('“day care”', 'DC FSA (dependent care FSA)')
  );

  /* Kathleen, pages 3–4 (FICA wage base, employer FICA example, pay transparency, unemployment, funding types, enrollment rules). */
  questions.push(
    kq('Kathleen: Social Security (6.2%) applies to wages up to what 2026 limit?', ['$168,600', '$176,100', '$184,500', 'No limit'], 2, 'SS stops at the $184,500 wage base. Medicare (1.45%) applies to ALL wages, no cap.'),
    kq('Which FICA tax has NO wage cap?', ['Social Security', 'Medicare', 'FUTA', 'SUTA'], 1, 'Medicare 1.45% is on all wages. Social Security stops at $184,500 (2026).'),
    kq('An employee earns a $60,000 salary. What does the EMPLOYER pay in FICA on top of salary?', ['$3,720', '$870', '$4,590', '$9,180'], 2, 'Employer SS 6.2% × 60,000 = 3,720 + Medicare 1.45% × 60,000 = 870 → $4,590 above the salary. ($9,180 would be employer + employee.)'),
    kq('In a FULLY INSURED health plan, the employer:', ['Pays claims as they happen', 'Pays the carrier a fixed premium', 'Has no costs', 'Must buy stop-loss'], 1, 'Fully insured = fixed premium to the carrier: predictable, less claims risk, less plan control, subject to state premium tax.'),
    kq('Which is TRUE of a SELF-FUNDED plan compared with fully insured?', ['Fixed, predictable cost', 'Less plan control', 'More claims risk, more control, employer keeps the savings', 'Subject to state premium tax'], 2, 'Self-funded: employer pays claims + admin → variable cost, more risk, more control, keeps savings. Usually paired with stop-loss.'),
    kq('Stop-loss coverage is best described as:', ['A COBRA extension', 'Insurance on top of insurance for a self-funded employer', 'An employee deductible', 'Unemployment insurance'], 1, 'Stop-loss protects a self-funded employer from very large claims: “insurance on top of insurance.”'),
    kq('Under the ACA, a child can stay on a parent’s health plan until age:', ['18', '21', '26', '30'], 2, 'At 26 you can no longer be on your parents’ insurance.'),
    kq('A child is covered by both parents’ plans. Under the birthday rule, the primary plan is:', ['The older parent’s', 'The parent whose birthday comes first in the calendar year', 'The father’s', 'The plan with the lower premium'], 1, 'Birthday rule: whoever’s birthday comes first in the year (month and day, not age) is primary.'),
    kq('Getting married lets an employee change insurance outside open enrollment because it is a:', ['COBRA event', 'Qualifying life event (QLE)', 'Stop-loss claim', 'Safe harbor'], 1, 'QLE examples: death, marriage, court order. Otherwise changes wait for open enrollment.'),
    kq('Unemployment insurance is:', ['Federal only, paid by employees', 'A federal–state program that replaces part of lost wages for eligible workers', 'Paid by the worker’s new employer', 'The same as workers’ comp'], 1, 'Federal–state program; replaces part of lost wages for eligible workers, with extra for dependents in Illinois.'),
    kq('Kathleen’s Illinois unemployment numbers: taxable wage base and new-employer rate are:', ['$7,000 and 0.6%', '$14,250 and 3.35%', '$184,500 and 6.2%', '$14,250 and 7.65%'], 1, 'Illinois: wage base $14,250, new-employer rate 3.35%, rates range about 0.75%–7.05%. ($7,000 / 0.6% is FUTA.)'),
    kq('Illinois pay transparency: a job posting must include:', ['Only the job title', 'The salary range and a general description of benefits', 'Every employee’s pay', 'The last person’s salary'], 1, 'Pay range + reasonable benefits description, and internal candidates must be told about the opening.'),
    kq('Kathleen noted Illinois paid leave accrues at:', ['1 hour per 20 hours worked', '1 hour per 40 hours worked', '1 day per month', 'Nothing until year 2'], 1, '1 hour for every 40 hours worked. Employers can also “front load” the hours up front.'),
    kq('Who pays for workers’ comp when an employee gets hurt at work?', ['The employee', 'The employer', 'Unemployment insurance', 'Medicare'], 1, 'Workers’ comp: employers pay.')
  );
  flashcards.push(
    kc('FICA limits (2026)', 'SS 6.2% up to $184,500 · Medicare 1.45% on ALL wages. Employer matches both.'),
    kc('Employer FICA on $60,000', '3,720 SS + 870 Medicare = $4,590 on top of salary.'),
    kc('Fully insured vs self-funded', 'Fully insured: fixed premium, predictable, less risk, less control, state premium tax. Self-funded: pays claims + admin, variable, more risk, more control, keeps savings, stop-loss.'),
    kc('Stop-loss', 'Insurance on top of insurance for a self-funded employer (caps huge claims).'),
    kc('Enrollment rules', 'ACA: on parents’ plan until 26. Birthday rule: parent whose birthday is first in the year = primary. QLE (death, marriage, court) = change now; otherwise wait for open enrollment.'),
    kc('Illinois unemployment (Kathleen)', 'Federal–state, replaces part of lost wages. IL wage base $14,250 · new employer 3.35% · range ~0.75–7.05% · extra for dependents.'),
    kc('Pay transparency (Illinois)', 'Postings show salary range + benefits description; tell internal candidates. Paid leave: 1 hr per 40 hrs worked, or front-loaded.')
  );
  cues.push(
    kk('“fixed premium to the carrier,” “predictable”', 'fully insured'),
    kk('“insurance on top of insurance”', 'stop-loss'),
    kk('“whose birthday is first”', 'birthday rule: that parent’s plan is primary'),
    kk('“marriage, death, court order”', 'qualifying life event (QLE)'),
    kk('“$184,500”', 'Social Security wage base (Medicare has none)')
  );

  /* ---- Guest speaker Derek Story, Wed 9/30: technology & AI in HR — from Wesley's class notes (topic 'ai'). */
  const DS = 'Guest speaker Derek Story (9/30)';
  let dn = 0;
  const dq = (prompt, options, answer, explanation) => ({ id: 'e3d-q' + (++dn), topic: 'ai', prompt, options, answer, answerKeyText: options[answer], explanation, source: DS });
  const dc = (front, back) => ({ id: 'e3d-c' + (++dn), topic: 'ai', front, back, source: DS, core: true });
  const dk = (clue, answer) => ({ id: 'e3d-k' + (++dn), topic: 'ai', clue, answer, source: DS });
  questions.push(
    dq('Moore’s Law is about:', ['Pay compression', 'The steady growth in computing power on microchips (CPUs/GPUs)', 'Minimum wage increases', 'Benefit costs'], 1, 'Moore’s Law: chip power keeps doubling, which drove the tech revolution (CPU → GPU).'),
    dq('Put the video-meeting tech in order:', ['Zoom → WebEx → AT&T Picturephone', 'AT&T Picturephone (1964) → CU-SeeMe (1992) → WebEx/GoToMeeting (1995–2004) → Zoom (2010s)', 'CU-SeeMe → Zoom → Picturephone', 'WebEx → Picturephone → Zoom'], 1, 'Derek’s timeline: 1964 Picturephone · 1992 CU-SeeMe · 1995–2004 WebEx & GoToMeeting · 2010–20 Zoom.'),
    dq('On Derek’s AI timeline, what came FIRST?', ['AlexNet', 'Lloyd’s of London (1689)', 'Autocorrect', 'GPT'], 1, '1689 Lloyd’s of London (risk/probability) → 1900s Markov → 1950s–60s the term “AI” → 90s–00s autocorrect → 2012 AlexNet → 2016 Tay → 2018 BERT → 2020 GPT.'),
    dq('Which matches Derek’s timeline?', ['2012 GPT', '2016 Microsoft Tay', '2018 AlexNet', '2020 BERT'], 1, '2012 AlexNet · 2016 Microsoft Tay · 2018 BERT · 2020 GPT.'),
    dq('Which law protects student education records?', ['HIPAA', 'FERPA', 'COPPA', 'GDPR'], 1, 'FERPA = student records. HIPAA = health info (student health services, child care). COPPA = kids online. GDPR = EU data privacy.'),
    dq('HIPAA would matter most for which campus data?', ['Grades', 'Student health services records', 'Course catalog', 'Parking permits'], 1, 'HIPAA covers health information, e.g. student health services and child care.'),
    dq('Which privacy law protects children online?', ['FERPA', 'COPPA', 'FMLA', 'ERISA'], 1, 'COPPA = Children’s Online Privacy Protection Act.'),
    dq('In the CRAFTY prompt method, the “A” stands for:', ['Accuracy', 'Audience: who it is for', 'Algorithm', 'Answer'], 1, 'C character · R request · A audience · F format/features · T tone · Y your extras/questions.'),
    dq('In CRAFTY, “C – Character” means:', ['Word count', 'Who the AI should act as (e.g., a professor)', 'Company culture', 'Compliance'], 1, 'Character = who the AI plays, e.g. professor or student.'),
    dq('Building an AI-friendly culture means AI use should be:', ['Secret and fast', 'Transparent and aligned with cultural values', 'Banned', 'Only for IT'], 1, '1. Transparent · 2. Aligns with cultural values.'),
    dq('The main disadvantages of AI in hiring and recruitment are:', ['Speed and cost', 'Compliance and accuracy', 'Too many applicants', 'Lower pay'], 1, 'Hiring & recruitment: disadvantages are compliance and accuracy.'),
    dq('If an AI hiring tool discriminates, who is liable?', ['Nobody', 'The software vendor only', 'The employer: an AI mistake is still the employer’s liability', 'The applicant'], 2, 'AI mistake is liable. This has happened in CA, CO, IL, NY and MD.'),
    dq('Which states did Derek list for AI hiring/discrimination issues?', ['TX, FL, OH', 'CA, CO, IL, NY, MD', 'WA, OR, NV', 'Only IL'], 1, 'CA, CO, IL, NY, MD.'),
    dq('Which was NOT one of the AI concerns raised by Bill Gates / Barack Obama?', ['Safety and security', 'Socializing the next generation', 'Environmental threats', 'Higher minimum wage'], 3, 'Concerns: safety/security, socializing the next generation, environmental threats.'),
    dq('Using AI as a translator in operations: good side vs bad side?', ['Good: translates; Bad: you need to know how to ask questions', 'Good: free; Bad: slow', 'Good: legal; Bad: illegal', 'No downside'], 0, 'Good: able to translate. Bad: depends on knowing how to ask questions.'),
    dq('Elizabeth Adams, PhD (cited by Derek) focuses on fairness, accountability, leadership and ___ in AI.', ['Profitability', 'Algorithmic accuracy', 'Speed', 'Marketing'], 1, 'Fairness · accountability · leadership · algorithmic accuracy in AI.')
  );
  flashcards.push(
    dc('Moore’s Law', 'Computing power on a microchip keeps doubling. Drove the tech revolution (CPU → GPU) and HRIS systems.'),
    dc('Video-meeting timeline', '1964 AT&T Picturephone · 1992 CU-SeeMe · 1995–2004 WebEx & GoToMeeting · 2010–20 Zoom.'),
    dc('AI timeline', '1689 Lloyd’s of London · 1900s Markov · 1950s–60s term “AI” · 90s–00s autocorrect · 2012 AlexNet · 2016 Microsoft Tay · 2018 BERT · 2020 GPT.'),
    dc('Privacy laws', 'FERPA student records · HIPAA health info (student health, child care) · COPPA kids online · GDPR EU data.'),
    dc('CRAFTY prompts', 'Character (who) · Request · Audience (for whom) · Format/Features · Tone (professional) · Your extras / questions.'),
    dc('AI-friendly culture', '1. Transparent · 2. Aligns with cultural values. Elizabeth Adams: fairness, accountability, leadership, algorithmic accuracy.'),
    dc('AI in hiring', 'Disadvantages: compliance + accuracy. AI mistakes = employer liable (CA, CO, IL, NY, MD).'),
    dc('AI concerns (Gates / Obama)', 'Safety & security · socializing the next generation · environmental threats.'),
    dc('Where AI shows up in HR', 'Hiring & recruitment · training & development · operations (translator: good at translating, bad if you can’t ask good questions).')
  );
  cues.push(
    dk('“chip power doubles”', 'Moore’s Law'),
    dk('“student records”', 'FERPA'),
    dk('“children online”', 'COPPA'),
    dk('“Character, Request, Audience…”', 'CRAFTY prompt method'),
    dk('“AI hiring tool discriminates”', 'employer is liable (compliance)')
  );

  /* ---- Compa-Ratio Exercise (handed out Mon 10/5). No answer key yet: answers worked by Claude with the class
     conventions (midpoint differential applies to the grade you move INTO; pay-table numbers use normal rounding).
     Problem 1 reads "ideal pay rate" as the grade midpoint (CR = 1.0). Check both against the 10/7 review. */
  const CX = 'Compa-Ratio Exercise (10/5) · worked, key pending';
  let xn = 0;
  const xq = (prompt, options, answer, explanation) => ({ id: 'e3x-q' + (++xn), topic: 'compa', prompt, options, answer, answerKeyText: options[answer], explanation, source: CX });
  const xc = (front, back) => ({ id: 'e3x-c' + (++xn), topic: 'compa', front, back, source: CX, core: true });
  questions.push(
    xq('Exercise P1: Grade 3’s midpoint is $57,964 and every midpoint differential is 10%. Grade 4’s midpoint is:', ['$52,695', '$63,760', '$66,659', '$69,557'], 1, '57,964 × 1.10 = 63,760.4 → 63,760.'),
    xq('Exercise P1: going DOWN from Grade 3 ($57,964, 10% differential), Grade 2’s midpoint is:', ['$52,168', '$52,695', '$49,269', '$63,760'], 1, 'Divide, don’t multiply by 0.90: 57,964 ÷ 1.10 = 52,695. (57,964 × 0.9 = 52,168 is the trap.)'),
    xq('Exercise P1: the market average for Employment Consultant (48,752 · 50,247 · 45,132) is:', ['$48,044', '$50,247', '$48,752', '$47,940'], 0, '144,131 ÷ 3 = 48,043.67 → $48,044.'),
    xq('Exercise P1: Accountant II (780 pts) is in Grade 4 (mid $63,760). Market average = $56,751. Company mid ÷ market =', ['0.89', '1.12', '1.25', '1.30'], 1, '63,760 ÷ 56,751 = 1.12: paying 12% above market, but inside 0.75–1.25.'),
    xq('Exercise P1 result: comparing each grade midpoint to the market, what do you recommend?', ['Raise Grade 2', 'Lower Grade 4', 'No change: all three jobs land inside 0.75–1.25', 'Rebuild the whole chart'], 2, 'EC 1.21 · IT 1.07 · Acct II 1.12 (or 0.83 / 0.94 / 0.89 the other way). All inside the ideal range → no change, and say WHY. Check this against Wednesday’s key.'),
    xq('Exercise P2: Grade 3 mid $67,860; Grade 4 has a 17% midpoint differential. Grade 4’s midpoint is:', ['$78,039', '$79,396', '$81,432', '$95,275'], 1, '67,860 × 1.17 = 79,396.2 → 79,396.'),
    xq('Exercise P2: Grade 5 has a 20% midpoint differential on top of Grade 4 ($79,396). Grade 5’s midpoint is:', ['$93,000', '$95,275', '$99,245', '$114,330'], 1, '79,396 × 1.20 = 95,275.2 → 95,275.'),
    xq('Exercise P2: Job A (700 pts) pays $59,780; Grade 4 mid = $79,396. Its compa-ratio is:', ['0.73', '0.75', '0.88', '1.33'], 1, '59,780 ÷ 79,396 = 0.753: right at the bottom of 0.75–1.25, and $19,616 below the midpoint.'),
    xq('Exercise P2: Job B (900 pts) pays $69,840; Grade 5 mid = $95,275. Compa-ratio and action?', ['0.73 → below 0.75, raise pay', '0.88 → fine', '1.36 → freeze', '0.73 → freeze'], 0, '69,840 ÷ 95,275 = 0.733 → below 0.75 → raise. It’s even under the Grade 5 minimum (76,220).'),
    xq('Exercise P2: Job C (300 pts) pays $51,655; Grade 2 mid = $59,009 (67,860 ÷ 1.15). Compa-ratio?', ['0.76', '0.88', '1.14', '0.73'], 1, '51,655 ÷ 59,009 = 0.875 → inside the range; $7,354 below mid. No urgent change.'),
    xq('Exercise P2: Job A’s CR is 0.75, technically “in range.” Why might you still raise it?', ['It’s above the max', 'It pays below the Grade 4 MINIMUM ($63,517 at a 20% range spread)', 'Its CR is above 1.25', 'Grade 4 has no midpoint'], 1, 'Min = 79,396 × 0.80 = 63,517. Pay of 59,780 is under the floor of its own range: raise to at least the minimum.'),
    xq('Exercise P2: how much would it cost to bring Job B up to the midpoint (CR = 1.0)?', ['$6,380', '$19,616', '$25,435', '$7,354'], 2, 'Raise to 1.0 = mid − pay = 95,275 − 69,840 = $25,435.')
  );
  flashcards.push(
    xc('Compa-ratio exercise: steps', '1 Fill the midpoints (× 1 + diff going up, ÷ 1 + diff going down) · 2 Min/max = mid × (1 ∓ range diff) · 3 Put each job in its grade by points · 4 CR = pay ÷ mid (or mid vs market) · 5 Act: <0.75 raise, >1.25 freeze, in range → explain why no change.'),
    xc('Going DOWN a grade', 'Divide by (1 + the differential of the grade above): 57,964 ÷ 1.10 = 52,695. NOT × 0.90 (52,168).'),
    xc('Exercise P2 answers', 'Mids: G2 59,009 · G3 67,860 · G4 79,396 · G5 95,275. Job A 0.75 (below G4 min 63,517) · Job B 0.73 → raise (cost to mid 25,435) · Job C 0.88 OK.'),
    xc('Exercise P1 answers (key pending)', 'Mids: G2 52,695 · G3 57,964 · G4 63,760. Market: EC 48,044 · IT 49,386 · Acct II 56,751. Mid ÷ market: 1.21 · 1.07 · 1.12 → all in range → no change.')
  );
  math.push(
    { id: 'e3m-cx2', title: 'Compa-Ratio Exercise · Problem 2 (10/5)', topic: 'compa', type: 'compa', source: CX, origin: 'notes',
      prompt: 'Grade 3 mid = $67,860. Midpoint differentials: G2 10%, G3 15%, G4 17%, G5 20%. Job A (700 pts) $59,780 · Job B (900 pts) $69,840 · Job C (300 pts) $51,655. Find each job’s compa-ratio (2 decimals) and how far Job B is below its midpoint.',
      fields: [$f('a', 'Job A CR', 0.75, '', 0.006), $f('b', 'Job B CR', 0.73, '', 0.006), $f('c', 'Job C CR', 0.88, '', 0.006), $f('gap', 'Job B below mid', 25435)],
      steps: ['G4 mid = 67,860 × 1.17 = 79,396 · G5 = 79,396 × 1.20 = 95,275 · G2 = 67,860 ÷ 1.15 = 59,009.', 'A (G4): 59,780 ÷ 79,396 = 0.75 · B (G5): 69,840 ÷ 95,275 = 0.73 · C (G2): 51,655 ÷ 59,009 = 0.88.', 'B gap: 95,275 − 69,840 = 25,435. B is below 0.75 → raise. A sits under the G4 minimum (63,517) → raise to at least the min.'] },
    { id: 'e3m-cx1', title: 'Compa-Ratio Exercise · Problem 1 (10/5)', topic: 'compa', type: 'compa', source: CX, origin: 'notes',
      prompt: 'Grade 3 mid = $57,964, all midpoint differentials 10%. Find the Grade 2 and Grade 4 midpoints, the Accountant II market average (59,134 · 54,326 · 56,794), and Grade 4 mid ÷ that market average.',
      fields: [$f('g2', 'Grade 2 midpoint', 52695), $f('g4', 'Grade 4 midpoint', 63760), $f('mkt', 'Accountant II market avg', 56751), $f('cr', 'G4 mid ÷ market', 1.12, '', 0.006)],
      steps: ['G4 = 57,964 × 1.10 = 63,760. G2 = 57,964 ÷ 1.10 = 52,695.', 'Market = 170,254 ÷ 3 = 56,751.', '63,760 ÷ 56,751 = 1.12 → inside 0.75–1.25. Same for the other two jobs (1.21, 1.07) → no change recommended.'] }
  );

  return {
    exam: 3, examDay: 'Mon 10/12', examDate: [2026, 9, 12, 12, 35], scope: 'Benefits + Slides 09–10 + payroll update + both guest speakers',
    note: 'Exam 3 is Mon 10/12 (150 pts). Canvas lists: Kathleen’s Benefits talk (that IS the benefits unit, no separate deck), Derek’s AI & HR talk, Compa-Ratios & Payroll class notes + exercises, and the Exec/Flexible Workforce lecture video. The compa-ratio exercise is in (answers worked by Claude; check them at the 10/7 review).',
    topics: [{ id: 'benefits', name: 'Benefits' }, { id: 'compa', name: 'Compa-Ratios' }, { id: 'payroll', name: 'Payroll' }, { id: 'flex', name: 'Flexible Workforce' }, { id: 'exec', name: 'Executive Pay' }, { id: 'ai', name: 'AI & HR' }],
    /* Class meetings the study plan shows on their day. */
    classes: [
      { day: '2026-10-05', title: 'Class 12:35: Compa-Ratios & Payroll lecture; the prof shows the exercises. Ask whether FICA comes off gross or after before-tax deductions', why: 'This lecture + the exercises are on Exam 3.', send: 'Send Claude the exercises + your notes' },
      { day: '2026-10-07', title: 'Class 12:35: review of the Compa-Ratio & Payroll exercises', why: 'Last class before the exam. Write down every answer.', send: 'Send Claude the worked answers' }
    ],
    /* Exam 3 material that isn't in the game yet. Shown as "Not yet available" cards. When you add one,
       give its questions/cards a topic id and move it into topics above, then delete it here. */
    pending: [
      { id: 'compa-exercise', name: 'Compa-Ratio exercise answer key', sub: 'Reviewed Wed 10/7', status: 'In progress', what: 'The exercise is in the game with answers worked by Claude. Send the answers from Wednesday’s review so they can be checked.' }
    ],
    questions, flashcards, cues, math, scenarioIds: questions.filter(x => x.prompt.length > 70).map(x => x.id), scenarioContexts: {}
  };
})();

/* Switch the active content set before the app starts. */
(() => {
  const dflt = Date.now() > new Date(2026, 8, 28, 15).getTime() ? '3' : '2'; // Exam 2 was Mon 9/28
  let exam = dflt; try { exam = localStorage.getItem('mgt354-exam') || dflt; } catch (e) { }
  window.ACTIVE_EXAM = exam === '3' ? 3 : 2;
  if (window.ACTIVE_EXAM === 3 && window.EXAM3_DATA) { window.EXAM2_DATA = window.STUDY_DATA; window.STUDY_DATA = window.EXAM3_DATA; }
  else { window.STUDY_DATA.exam = 2; window.STUDY_DATA.examDay = 'Mon 9/28'; window.STUDY_DATA.examDate = [2026, 8, 28, 12, 35]; window.STUDY_DATA.scope = 'Slides 06–08 + Sam Lewis'; }
})();

/* "Not yet available" cards for Exam 3 material that hasn't been added. Used on Home and the Campaign map. */
window.pendingHTML = where => {
  const list = (window.STUDY_DATA && window.STUDY_DATA.pending) || [];
  if (!list.length) return '';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cards = list.map(p => `<div class="pending-card" aria-disabled="true"><span class="pending-status ${p.status === 'In progress' ? 'is-progress' : ''}">${esc(p.status)}</span><strong>${esc(p.name)}</strong><small>${esc(p.sub)}</small><p>${esc(p.what)}</p></div>`).join('');
  const head = where === 'campaign' ? 'Locked sectors' : 'Coming to Exam 3';
  const note = where === 'campaign' ? 'These unlock once the material is added.' : 'Not in the game yet';
  return `<section class="pending-section"><div class="section-heading"><h2>${head}</h2><span class="section-note">${note}</span></div><div class="pending-grid">${cards}</div></section>`;
};
