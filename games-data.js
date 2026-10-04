/* Content for the game modes (Sort it, Put it in order, Odd one out, Swipe, Memory match).
   Every fact here is already in the Exam 3 pack (exam3.js) or the 10/3 Payroll Update; nothing new is introduced.
   Find the mistake and Build the paycheck generate their own numbers in games.js. */
window.GAMES_DATA = {
  3: {
    sort: [
      { id: 'deduct', title: 'Where does it come out?', topic: 'payroll', buckets: ['Before-tax', 'Taxes', 'After-tax'], items: [
        ['Health insurance premium', 0], ['Traditional 401(k)', 0], ['HSA contribution', 0], ['FSA contribution', 0], ['Commuter benefits', 0],
        ['Federal income tax', 1], ['Social Security', 1], ['Medicare', 1], ['State income tax', 1],
        ['Roth 401(k)', 2], ['Union dues', 2], ['Wage garnishment', 2], ['Charity', 2]] },
      { id: 'whopays', title: 'Who pays this tax?', topic: 'payroll', buckets: ['Employee only', 'Employer only', 'Both'], items: [
        ['Federal income tax', 0], ['State income tax', 0], ['FUTA', 1], ['SUTA', 1], ['Social Security (6.2%)', 2], ['Medicare (1.45%)', 2]] },
      { id: 'required', title: 'Required by law or optional?', topic: 'benefits', buckets: ['Legally required', 'Discretionary'], items: [
        ['Workers’ compensation', 0], ['Social Security / Medicare', 0], ['Unemployment insurance', 0],
        ['Health insurance', 1], ['401(k) plan', 1], ['Paid vacation', 1], ['Pension plan', 1], ['Life insurance', 1]] },
      { id: 'contractor', title: 'Employee or contractor sign?', topic: 'flex', buckets: ['Points to employee', 'Points to contractor'], items: [
        ['Employer controls the details', 0], ['Supervised on the job', 0], ['Employer provides the tools', 0], ['Paid by the hour', 0], ['Extended relationship', 0], ['Works for one employer', 0],
        ['Worker controls the details', 1], ['Specialized skill', 1], ['Uses own tools and site', 1], ['Paid by the project', 1], ['Limited time', 1], ['Serves several businesses', 1]] },
      { id: 'tests', title: 'Which classification test lists it?', topic: 'flex', buckets: ['Common-law only', 'Economic realities only', 'Both tests'], items: [
        ['Intent', 0], ['Method of payment', 0], ['Supervision', 0], ['Works for more than one firm', 0],
        ['Investment in facilities', 1], ['Risk of profit or loss', 1],
        ['Right to control', 2], ['Skill', 2], ['Integration', 2], ['Continuing relationship', 2]] },
      { id: 'taxes', title: 'Federal or Illinois income tax?', topic: 'payroll', buckets: ['Federal', 'Illinois'], items: [
        ['Progressive brackets', 0], ['Seven rates, 10% to 37%', 0], ['Base + rate × amount over the floor', 0], ['W-4 with no allowances', 0],
        ['Flat 4.95%', 1], ['One rate on all taxable pay', 1], ['Form uses allowances', 1], ['Called a “fixed” rate on Canvas', 1]] },
      { id: 'compa', title: 'Where does this compa-ratio fall?', topic: 'compa', buckets: ['Below 0.75', 'Ideal (0.75–1.25)', 'Above 1.25'], items: [
        ['0.66', 0], ['0.72', 0], ['0.75', 1], ['0.85', 1], ['1.00', 1], ['1.18', 1], ['1.25', 1], ['1.28', 2], ['1.32', 2]] },
      { id: 'dbdc', title: 'Defined benefit or defined contribution?', topic: 'benefits', buckets: ['Defined benefit', 'Defined contribution'], items: [
        ['Employer bears the investment risk', 0], ['The monthly benefit is promised', 0], ['Encourages retention', 0], ['Protected by the PBGC', 0],
        ['Employee bears the investment risk', 1], ['A 401(k)', 1], ['Balance depends on market returns', 1], ['Portable, supports mobility', 1]] },
      { id: 'execpay', title: 'Which part of the executive package?', topic: 'exec', buckets: ['Short-term incentive', 'Long-term incentive', 'Perquisite', 'Benefit'], items: [
        ['Annual bonus', 0], ['Bonus tied to profit, revenue, cash flow', 0], ['Stock options', 1], ['Stock grants', 1],
        ['Company car the family can use', 2], ['Club membership', 2], ['Health insurance', 3], ['Retirement plan', 3]] },
      { id: 'laws', title: 'Which law is it?', topic: 'benefits', buckets: ['FMLA', 'COBRA', 'HIPAA', 'ERISA'], items: [
        ['50+ employees within 75 miles', 0], ['Up to 12 weeks unpaid leave', 0], ['20+ employees', 1], ['Up to 102% of the premium', 1], ['18 months of coverage', 1],
        ['Limits preexisting-condition denials', 2], ['Strict privacy rules', 2], ['Requires vesting', 3], ['Created the PBGC', 3]] }
    ],
    order: [
      { id: 'payroll6', title: 'The 6 payroll steps', topic: 'payroll', steps: ['Time collection', 'Approval & entry', 'Calculations', 'Review & audit', 'Disbursement', 'Reporting'] },
      { id: 'flow', title: 'The paycheck deduction flow', topic: 'payroll', steps: ['Gross pay', 'Before-tax deductions', 'Taxes (federal, SS, Medicare, state)', 'After-tax deductions', 'Net pay'] },
      { id: 'fedsteps', title: 'Figuring federal income tax', topic: 'payroll', steps: ['Annualize the pay', 'Subtract before-tax deductions → taxable income', 'Find the bracket: base + rate × (taxable − floor)', 'Divide by the number of pay periods'] },
      { id: 'w4', title: 'The 2025 W-4, top to bottom', topic: 'payroll', steps: ['Step 1: personal info + filing status', 'Step 2: multiple jobs or spouse works', 'Step 3: claim dependents', 'Step 4: other adjustments (incl. extra withholding)', 'Step 5: sign and date'] },
      { id: 'group', title: 'Group compa-ratio', topic: 'compa', steps: ['Add up every employee’s pay', 'Divide by the number of employees (average)', 'Divide the average by the midpoint', 'Compare the result with 0.75–1.25'] },
      { id: 'laws', title: 'Benefit laws, oldest to newest', topic: 'benefits', steps: ['Social Security Act (1935)', 'Medicare added (1965)', 'ERISA (1974)', 'COBRA (1985)', 'FMLA (1993)', 'HIPAA (1996)', 'PPACA (2010)'] },
      { id: 'exec', title: 'Pricing an executive package', topic: 'exec', steps: ['Annualize the bonus (quarterly × 4)', 'Add all five components', 'Base salary ÷ total', 'Incentives (short + long) ÷ total'] },
      { id: 'ot', title: 'Overtime to net pay', topic: 'payroll', steps: ['Regular pay = 40 × rate', 'Overtime = hours over 40 × rate × 1.5', 'Gross = regular + overtime', 'SS and Medicare off gross', 'Subtract income tax and other deductions → net'] }
    ],
    odd: [
      { topic: 'payroll', items: ['Health insurance', 'Traditional 401(k)', 'HSA', 'Roth 401(k)'], odd: 3, why: 'Roth is after-tax. The others come out before taxes.' },
      { topic: 'payroll', items: ['Union dues', 'Garnishments', 'Charity', 'Commuter benefits'], odd: 3, why: 'Commuter benefits are before-tax. The others are after-tax.' },
      { topic: 'benefits', items: ['Workers’ comp', 'Unemployment insurance', 'Social Security', 'Health insurance'], odd: 3, why: 'Health insurance is discretionary. The other three are legally required.' },
      { topic: 'payroll', items: ['FUTA', 'SUTA', 'Employer FICA match', 'Federal income tax withheld'], odd: 3, why: 'Income tax is the employee’s. The other three are paid by the employer.' },
      { topic: 'flex', items: ['Part-time worker', 'On-call worker', 'Leased employee', 'Student leaving to go back to school'], odd: 3, why: 'Leaving for personal reasons (school, retiring) is NOT contingent.' },
      { topic: 'exec', items: ['Base salary', 'Stock options', 'Perquisites', 'Overtime pay'], odd: 3, why: 'Overtime isn’t one of the five executive pay elements.' },
      { topic: 'benefits', items: ['HMO', 'PPO', 'POS', 'FSA'], odd: 3, why: 'An FSA is a spending account. The others are health plan types.' },
      { topic: 'benefits', items: ['Copay', 'Deductible', 'Coinsurance', 'Vesting'], odd: 3, why: 'Vesting is about retirement money. The others are health-cost terms.' },
      { topic: 'compa', items: ['0.80', '0.95', '1.10', '1.30'], odd: 3, why: '1.30 is outside the 0.75–1.25 ideal range.' },
      { topic: 'payroll', items: ['10%', '12%', '22%', '4.95%'], odd: 3, why: '4.95% is Illinois’s flat rate. The others are federal brackets.' },
      { topic: 'benefits', items: ['FMLA', 'COBRA', 'HIPAA', 'FUTA'], odd: 3, why: 'FUTA is an unemployment tax. The others are benefit laws.' },
      { topic: 'flex', items: ['Investment in facilities', 'Risk of profit or loss', 'Integration', 'Intent'], odd: 3, why: 'Intent is on the common-law test only. The others are economic-realities factors.' },
      { topic: 'flex', items: ['Flextime', 'Compressed workweek', 'Telecommuting', 'Job sharing'], odd: 3, why: 'Job sharing splits one job between part-timers. The others are the three flexible schedules.' },
      { topic: 'payroll', items: ['Time collection', 'Calculations', 'Disbursement', 'W-4'], odd: 3, why: 'The W-4 is a form, not one of the six payroll steps.' },
      { topic: 'exec', items: ['Profit', 'Revenue', 'Cash flow', 'Seniority'], odd: 3, why: 'Executive bonuses are measured on profit, revenue and cash flow.' },
      { topic: 'benefits', items: ['401(k)', 'Employee bears the risk', 'Portable', 'PBGC guarantee'], odd: 3, why: 'The PBGC backs defined BENEFIT pensions. The others describe defined contribution.' },
      { topic: 'payroll', items: ['Step 2: multiple jobs', 'Step 3: dependents', 'Step 4(c): extra withholding', 'Allowances'], odd: 3, why: 'The federal W-4 dropped allowances in 2020. Only the IL-W-4 uses them.' },
      { topic: 'compa', items: ['Internal pay policy', 'Market value', 'Range midpoint', 'Range minimum'], odd: 3, why: 'A compa-ratio never uses the range minimum.' }
    ],
    swipe: [
      ['Total FICA withheld from an employee is 7.65%.', true, '6.2% Social Security + 1.45% Medicare.'],
      ['Illinois has a flat 4.95% income tax.', true, 'One rate, no brackets.'],
      ['The federal W-4 uses allowances.', false, 'Dropped in the 2020 redesign. The IL-W-4 still uses them.'],
      ['A Roth 401(k) is an after-tax deduction.', true, 'It doesn’t lower taxable income.'],
      ['Tax on $49,000 of taxable income is 22% × $49,000.', false, 'Only the dollars over $48,475 get 22%: $5,694.50.'],
      ['FMLA leave is unpaid.', true, 'Up to 12 weeks unpaid, job protected.'],
      ['The former employer pays for COBRA coverage.', false, 'The ex-employee pays, up to 102% of the premium.'],
      ['ERISA requires portability.', false, 'It requires vesting, not portability.'],
      ['Workers’ comp is no-fault.', true, 'Covered even if careless; in exchange, can’t sue.'],
      ['Part-time workers are protected under PPACA.', false, 'They aren’t.'],
      ['Base salary is about 8.7% of CEO pay.', true, 'Incentives are the bulk.'],
      ['Bonuses are a growing share of executive pay.', false, 'Shrinking. Long-term incentives are growing.'],
      ['FUTA is 0.6% of the first $7,000 each worker earns.', true, '$42 per worker.'],
      ['In a 401(k), the employee bears the investment risk.', true, 'Defined contribution: only the contribution is fixed.'],
      ['A compa-ratio divides pay by the range minimum.', false, 'By the midpoint (or the market rate).'],
      ['The ideal compa-ratio range is 0.75–1.25.', true, ''],
      ['A worker leaving to go back to school is a contingent worker.', false, 'Personal reasons don’t count.'],
      ['The employee gives the W-4 to the IRS.', false, 'It goes to the employer.'],
      ['Payroll records should be kept at least 3–4 years.', true, ''],
      ['HSA money is use-it-or-lose-it.', false, 'That’s an FSA. HSA money rolls over.'],
      ['Before-tax deductions come out before taxes are figured.', true, 'So they lower taxable income.'],
      ['Medicare’s 1.45% comes off pay left after Social Security.', false, 'Off gross.'],
      ['The employer matches the employee’s FICA.', true, 'Employer pays its own 7.65% too.'],
      ['Private employers must close on federal holidays.', false, 'They don’t have to.'],
      ['Experience rating ties a company’s unemployment tax to its layoff history.', true, ''],
      ['A leased employee gets a W-2 from the staffing agency.', true, 'The agency is the legal employer.'],
      ['The effective tax rate is higher than the marginal rate.', false, 'It’s lower: lower slices are taxed at lower rates.'],
      ['W-4 Step 4(c) is for extra withholding each paycheck.', true, ''],
      ['A bi-weekly paycheck is annualized by multiplying by 26.', true, 'Monthly 12 · semi-monthly 24 · weekly 52.'],
      ['Benefits are about 42% of total compensation.', false, 'About 30% of total comp. 42 cents is per $1 of wages.'],
      ['COBRA applies to employers with 20 or more employees.', true, 'FMLA is the 50-employee one.'],
      ['Long-term incentives are stock options and stock grants.', true, '']
    ],
    pairs: [
      ['7.65%', 'Total FICA'], ['6.2%', 'Social Security'], ['1.45%', 'Medicare'], ['4.95%', 'Illinois income tax'], ['0.6% × $7,000', 'FUTA per worker'],
      ['102%', 'COBRA max premium'], ['12 weeks', 'FMLA unpaid leave'], ['50 employees', 'FMLA threshold'], ['20 employees', 'COBRA threshold'],
      ['8.7%', 'CEO base salary share'], ['0.75–1.25', 'Ideal compa-ratio'], ['2/3 of wage', 'Workers’ comp benefit'], ['× 1.25', '25% leasing fee'],
      ['3 years', 'Cliff vesting'], ['30%', 'Benefits share of total comp'], ['× 26', 'Bi-weekly to annual'], ['1935', 'Social Security Act'], ['1974', 'ERISA'],
      ['$1,193', 'Base tax at the 12% bracket'], ['$48,475', 'Where 22% starts'], ['Step 4(c)', 'Extra withholding'], ['3–4 years', 'Keep payroll records']
    ]
  }
};
