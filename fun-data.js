/* Content for the fun modes: "spot the trap" pairs, boss dialogue, and campaign story chapters.
   Trap pairs come from the "Common trap" lines of the Exam 3 Study Guide and the ⚠ lines of the Exam 3 Formula Sheet. */
window.FUN_DATA = {
  traps: {
    3: [
      { q: 'Benefits as a share of TOTAL compensation', a: 'About 30%', b: 'About 42%', why: '42 cents is per $1 of WAGES. Different denominator.' },
      { q: 'A noncontributory benefit plan means…', a: 'The employer pays the whole cost', b: 'Nobody contributes', why: 'It means the EMPLOYEE contributes nothing.' },
      { q: 'A flat dollar amount per doctor visit', a: 'Copay', b: 'Coinsurance', why: 'Coinsurance is a percentage of the bill after the deductible.' },
      { q: 'A percentage of the bill after the deductible', a: 'Coinsurance', b: 'Copay', why: 'Copay is the flat dollar amount.' },
      { q: 'How long until the employer’s pension money is yours', a: 'Vesting', b: 'Portability', why: 'Portability is moving it to a new employer.' },
      { q: 'What ERISA requires', a: 'Vesting schedules', b: 'Portability', why: 'ERISA does not require portability; it’s voluntary.' },
      { q: 'FMLA leave is…', a: 'Unpaid, up to 12 weeks', b: 'Paid, up to 12 weeks', why: 'FMLA guarantees the job back, not the paycheck.' },
      { q: 'Who pays for COBRA coverage', a: 'The former employee (up to 102%)', b: 'The employer', why: 'COBRA extends coverage; the ex-employee pays for it.' },
      { q: 'FMLA applies to employers with…', a: '50+ employees within 75 miles', b: '20+ employees', why: '20 is COBRA’s threshold. Don’t flip them.' },
      { q: 'COBRA applies to employers with…', a: '20+ employees', b: '50+ employees', why: '50 is FMLA’s threshold.' },
      { q: 'In a defined BENEFIT plan, investment risk is on…', a: 'The employer', b: 'The employee', why: 'The benefit is fixed, so the employer absorbs market risk.' },
      { q: 'In a defined CONTRIBUTION plan (401k), investment risk is on…', a: 'The employee', b: 'The employer', why: 'Only the contribution is fixed; the balance rides the market.' },
      { q: 'Workers’ comp when the employee caused the accident', a: 'Still covered (no-fault)', b: 'Not covered', why: 'It’s no-fault. The trade-off is they can’t sue.' },
      { q: 'Workers’ compensation is run by…', a: 'Each state', b: 'The federal government', why: 'State law; compulsory in 47 states.' },
      { q: 'Unemployment insurance generally covers…', a: 'Involuntary job loss', b: 'Quitting', why: 'Quitting generally doesn’t qualify.' },
      { q: 'Unions and benefits', a: 'A reason benefits GREW', b: 'A legally required benefit', why: 'Keep “why they grew” separate from “what the law requires.”' },
      { q: 'A compa-ratio divides pay by the range…', a: 'Midpoint', b: 'Minimum', why: 'Never the min or max.' },
      { q: 'The internal fix for a HIGH compa-ratio', a: 'Freeze increases (tenure caveat)', b: 'Cut their pay', why: 'Freeze internally; decreasing is the external-side consideration.' },
      { q: 'Payroll percentages (6.2%, 1.45%) come off…', a: 'Gross pay', b: 'The running balance', why: 'Take Medicare off gross, not off what’s left after Social Security.' },
      { q: 'Taxes the employer pays that the employee doesn’t', a: 'FUTA and SUTA', b: 'FICA', why: 'Both pay FICA; FUTA/SUTA are employer-only.' },
      { q: 'Total FICA withheld from the employee', a: '7.65%', b: '15.30%', why: '15.3% is employee + employer combined.' },
      { q: 'W-4 vs W-2', a: 'W-4 at hire, W-2 at year end', b: 'W-2 at hire, W-4 at year end', why: 'W-4 sets withholding; W-2 reports the year.' },
      { q: 'Federal tax on $49,000 of taxable income', a: '$5,579 + 22% of the amount over $48,475', b: '22% × $49,000', why: 'Marginal brackets: only dollars above the floor get the top rate.' },
      { q: 'A Roth 401(k) contribution', a: 'After-tax (doesn’t lower taxes)', b: 'Before-tax, like a 401(k)', why: 'Same account family, opposite layer.' },
      { q: 'Illinois income tax', a: 'Flat 4.95%', b: 'Brackets like federal', why: '“Fixed” rate per the Canvas page.' },
      { q: 'Allowances are used on…', a: 'The Illinois IL-W-4', b: 'The federal W-4', why: 'Federal dropped allowances in 2020.' },
      { q: 'Where the employee gives the W-4', a: 'To the employer', b: 'To the IRS', why: 'The employer uses it to set withholding.' },
      { q: 'A worker leaving in May to return to school', a: 'NOT a contingent worker', b: 'A contingent worker', why: 'Personal reasons (school, retiring) don’t count.' },
      { q: 'A part-time cashier', a: 'A contingent worker', b: 'A core employee', why: 'Part-timers are contingent.' },
      { q: 'Health insurance for part-time workers', a: 'Need not be offered at all', b: 'Must be offered under PPACA', why: 'Part-timers aren’t protected under PPACA.' },
      { q: 'Retirement plans for part-time workers', a: 'Must allow them in after ERISA age/service', b: 'Need not be offered at all', why: 'Different rule from health insurance.' },
      { q: '“Investment in facilities” and “risk of profit or loss”', a: 'Economic realities test only', b: 'Common-law test', why: 'Those two never appear on the common-law list.' },
      { q: '“Intent” and “method of payment”', a: 'Common-law test', b: 'Economic realities test', why: 'Common law only.' },
      { q: 'A company car the exec’s spouse can use', a: 'Perquisite', b: 'Benefit', why: 'Perks attach to the position and extend to family.' },
      { q: 'Base salary as a share of exec total pay', a: 'About 8.7%', b: 'About 50%', why: 'Incentives are the bulk.' },
      { q: 'Bonuses as a share of exec pay are…', a: 'Getting smaller', b: 'Getting larger', why: 'Long-term incentives are growing instead.' },
      { q: 'Private employers and federal holidays', a: 'Not required to close', b: 'Required to close', why: 'That’s why the paid-alternative-day rule exists.' },
      { q: 'Low perceived value of benefits. The fix is…', a: 'Better communication', b: 'Add another benefit', why: 'Employees don’t know what they have.' },
      { q: 'Employee FACTOR in benefit design', a: 'Personal needs (age, dependents)', b: 'Competitor offerings', why: 'Competitor offerings is an EMPLOYER factor.' }
    ],
    2: [
      { q: 'Pay for a point total: round the increment…', a: 'UP', b: 'Normally', why: 'Job pay rounds UP.' },
      { q: 'Piecework full sets: round…', a: 'DOWN', b: 'UP', why: 'Only complete sets count.' },
      { q: 'Weighted mean divides by…', a: 'Total employees', b: 'Number of jobs', why: 'Weight by headcount.' },
      { q: 'Midpoint differential applies to the grade you move…', a: 'INTO', b: 'Out of', why: 'Shown on the destination grade.' },
      { q: 'A quarterly bonus of $5,000 per year is…', a: '$20,000', b: '$5,000', why: 'Annualize: × 4.' },
      { q: 'IQR splits the halves…', a: 'Excluding the overall median', b: 'Including the median', why: 'Class convention excludes it.' }
    ]
  },

  /* Boss lines: intro when the battle starts, then a random taunt on your miss / hurt on your hit, charge before the math attack. */
  bosses: {
    benefits: { intro: 'ACTUARY-12 online. Every dollar you think is free has a price you never noticed.', taunt: ['That coverage was contributory. You paid for that mistake.', 'Adverse selection detected. You chose what you already knew.', 'Copay or coinsurance? You guessed.'], hurt: ['Claim processed… against me.', 'My premiums are rising.', 'Vesting… interrupted.'], charge: 'Calculating your weekly benefit. Two-thirds of nothing is nothing.', defeat: 'Benefits… were never fringe…' },
    compa: { intro: 'AUDITOR-09 online. Your ratio is below the band. Recommend: freeze.', taunt: ['Divided by the minimum? Tragic.', 'Outside 0.75 to 1.25. Flagged.', 'Your pay policy is non-compliant.'], hurt: ['Ratio… destabilizing.', 'Recalculating midpoint…', 'Audit trail corrupted.'], charge: 'Running a group compa-ratio. Average first, if you can.', defeat: 'Ratio… one point… zero…' },
    payroll: { intro: 'LEDGER-09 online. Gross in. Net out. You are a deduction.', taunt: ['Taken off the running balance? Rejected.', 'W-2 filed to the wrong worker.', 'Late filing. Penalty applied.'], hurt: ['Withholding… failed.', 'Disbursement halted.', 'Audit step skipped. Error.'], charge: 'Overtime detected. Compute gross before I disburse you.', defeat: 'Final report… submitted…' },
    flex: { intro: 'CONTRACTOR-10 online. No contract for ongoing employment. No mercy either.', taunt: ['You invested in my equipment. Economic realities say: mine.', 'Leaving for school? Not contingent. Not correct.', 'The agency owns this worker.'], hurt: ['Contract… terminated early.', 'Staffing fee rejected.', 'Integration test failed.'], charge: 'Invoice incoming: rate times hours times one-point-two-five.', defeat: 'Assignment… ended…' },
    exec: { intro: 'EXECUTIVE-10 online. Base salary is 8.7% of me. The rest is leverage.', taunt: ['You forgot to annualize the bonus.', 'That was a perk, not a benefit.', 'The board is not impressed.'], hurt: ['Stock options… underwater.', 'Balanced scorecard… unbalanced.', 'Golden parachute… deploying…'], charge: 'Total compensation audit. Add every component or fall.', defeat: 'Package… liquidated…' },
    all: { intro: 'CORE ARCHIVE online. Every topic. Every trap. One attempt.', taunt: ['The archive remembers every miss.', 'That was on the formula sheet.', 'Read the bold words next time.'], hurt: ['Archive sector lost.', 'Memory… fragmenting.', 'Index corrupted.'], charge: 'Final calculation. Show your work.', defeat: 'Archive… restored… to you…' },
    competitiveness: { intro: 'SENTINEL-06 online. Lead, match, or lag. You lag.', taunt: ['That was a market pricing question.', 'Benchmark missed.'], hurt: ['Market position slipping.', 'Survey data corrupted.'], charge: 'Compute pay level. Divide by headcount.', defeat: 'Market… exited…' },
    structures: { intro: 'ARCHITECT-07 online. Every grade has a midpoint. Yours is zero.', taunt: ['Rounded down? Pay rounds UP.', 'Wrong grade width.'], hurt: ['Range spread collapsing.', 'Structure… compressing.'], charge: 'Build the grade. Midpoint times one plus the differential.', defeat: 'Blueprint… lost…' },
    merit: { intro: 'ASSESSOR-08 online. Your performance rating: needs improvement.', taunt: ['Recency error detected.', 'Halo effect. Everyone sees it.'], hurt: ['Rating inflated.', 'Merit matrix failing.'], charge: 'Count the full sets. Round down.', defeat: 'Appraisal… complete…' },
    sam: { intro: 'FOREMAN online. The guest speaker said it. Did you write it down?', taunt: ['You weren’t listening.', 'That was in the talk.'], hurt: ['Shift ending.', 'Crew walking off.'], charge: 'Pay-level check. Show your math.', defeat: 'Clocking… out…' }
  },

  /* Campaign story: one chapter per sector. "log" shows until the boss falls; "after" once it’s cleared. */
  story: {
    3: {
      benefits: { ch: 'Chapter 1 · The Hidden Thirty', log: 'Signal from the archive: nearly a third of every paycheck is invisible. The Actuary guards it, and nobody knows what their benefits are worth.', after: 'The Actuary fell. The hidden thirty percent is mapped: required, discretionary, and every law that fences them in.' },
      compa: { ch: 'Chapter 2 · The Ratio', log: 'Pay drifts. The Auditor measures everyone against a midpoint and freezes anyone who strays past 1.25.', after: 'The Auditor’s band is yours now: below 1, raise. Above 1.25, freeze. Divide by the midpoint, always.' },
      payroll: { ch: 'Chapter 3 · The Ledger', log: 'Every paycheck passes through the Ledger: gross in, taxes out, six steps from time clock to report.', after: 'The Ledger is balanced. 6.2 plus 1.45, off gross, never off the balance.' },
      flex: { ch: 'Chapter 4 · The Contract', log: 'Workers who never signed on for long. The Contractor hides them behind agencies and 1099s.', after: 'The Contractor is exposed: four kinds of flexible worker, two tests to tell them apart.' },
      exec: { ch: 'Chapter 5 · The Top Floor', log: 'At the top of the tower, salary is only 8.7% of the story. The Executive is paid in futures.', after: 'The Top Floor is quiet. Base, bonus, long-term, benefits, perks: five parts, and you can price them all.' },
      final: { ch: 'Final · The Core Archive', log: 'Every sector clear opens the Core Archive. Exam 3 waits on the other side.', after: 'The archive is yours. See you on exam day.' }
    },
    2: {
      competitiveness: { ch: 'Chapter 1 · The Market', log: 'The Sentinel watches the market line. Lead, match, or lag.', after: 'The market line is yours.' },
      structures: { ch: 'Chapter 2 · The Blueprint', log: 'The Architect builds grades from points and midpoints.', after: 'The blueprint holds.' },
      merit: { ch: 'Chapter 3 · The Review', log: 'The Assessor rates everyone, and rarely fairly.', after: 'The review is over.' },
      sam: { ch: 'Chapter 4 · The Floor', log: 'The Foreman runs the floor the guest speaker described.', after: 'The floor is quiet.' },
      final: { ch: 'Final · The Core Archive', log: 'All sectors clear opens the archive.', after: 'Exam 2 complete.' }
    }
  }
};
