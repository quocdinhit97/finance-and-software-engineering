/**
 * Loan mathematics used by every chart and calculator in the book.
 *
 * Conventions (Chương 2, mục 2.1 and Phụ lục C):
 *  - Ordinary annuity: payments at the end of each monthly period.
 *  - Periodic rate r = nominal annual rate / 12. Under the 30/360 day-count
 *    convention used by VLP (daily rate = nominal / 360, 30 days per month)
 *    this is the same monthly rate.
 *  - Amounts are whole VND. PMT is rounded HALF_UP to 0 decimals once;
 *    each month's interest is rounded HALF_UP to 0 decimals; the final
 *    instalment absorbs the rounding residue so the balance closes at exactly 0.
 *
 * Interest per period is computed exactly with BigInt arithmetic, so the
 * schedule is reproducible to the đồng. The PMT itself uses floating point
 * internally (15+ significant digits for amounts below 10^12 VND), then is
 * rounded once.
 */

export interface ScheduleRow {
  period: number;
  openingBalance: number;
  interest: number;
  principal: number;
  payment: number;
  closingBalance: number;
}

export interface Schedule {
  payment: number; // regular instalment (PMT)
  rows: ScheduleRow[];
  totalInterest: number;
  totalPayment: number;
}

/** Annual rate in percent (e.g. 18 or 18.5) -> integer basis points of 1/100 %. */
function toCentiPercent(annualRatePct: number): bigint {
  return BigInt(Math.round(annualRatePct * 100));
}

/** HALF_UP rounding of a non-negative rational num/den to an integer. */
function roundHalfUp(num: bigint, den: bigint): bigint {
  return (num * 2n + den) / (den * 2n);
}

/** PMT = PV * r(1+r)^n / ((1+r)^n - 1), rounded HALF_UP to whole VND. */
export function annuityPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) throw new Error('months must be positive');
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  const f = Math.pow(1 + r, months);
  const raw = (principal * r * f) / (f - 1);
  return Math.floor(raw + 0.5);
}

/** Monthly interest on a balance, exact: balance * rate% / 100 / 12, HALF_UP. */
export function monthlyInterest(balance: number, annualRatePct: number): number {
  const cp = toCentiPercent(annualRatePct); // rate * 100
  // balance * (cp / 10000) / 12 = balance * cp / 120000
  return Number(roundHalfUp(BigInt(balance) * cp, 120000n));
}

export function amortizationSchedule(principal: number, annualRatePct: number, months: number): Schedule {
  const pmt = annuityPayment(principal, annualRatePct, months);
  const rows: ScheduleRow[] = [];
  let balance = principal;
  for (let k = 1; k <= months; k++) {
    const interest = monthlyInterest(balance, annualRatePct);
    let principalPart = pmt - interest;
    let payment = pmt;
    if (k === months || principalPart > balance) {
      principalPart = balance; // last instalment closes the balance exactly
      payment = principalPart + interest;
    }
    rows.push({
      period: k,
      openingBalance: balance,
      interest,
      principal: principalPart,
      payment,
      closingBalance: balance - principalPart,
    });
    balance -= principalPart;
    if (balance === 0 && k < months) break;
  }
  const totalPayment = rows.reduce((s, r) => s + r.payment, 0);
  return {payment: pmt, rows, totalInterest: totalPayment - principal, totalPayment};
}

/**
 * Monthly internal rate of return for a cash-flow series where cf[0] is the
 * amount actually received (positive) and cf[1..n] are repayments (negative).
 * Solved by bisection on [0, 100%] per month; returns NaN if no sign change.
 */
export function monthlyIrr(cashflows: number[]): number {
  const npv = (r: number) => cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
  let lo = 0;
  let hi = 1;
  if (npv(lo) * npv(hi) > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export interface CostOfCredit {
  netDisbursed: number;
  monthlyOutflow: number;
  irrMonthly: number;
  apr: number; // IRR_monthly * 12
  eir: number; // (1 + IRR_monthly)^12 - 1
}

/**
 * Cost of credit with an up-front fee deducted from the disbursement and a
 * fixed monthly fee added to every instalment (the structure used in
 * Chương 2, mục 2.2). The final instalment's rounding adjustment is included.
 */
export function costOfCredit(
  principal: number,
  annualRatePct: number,
  months: number,
  upfrontFee: number,
  monthlyFee: number,
): CostOfCredit {
  const s = amortizationSchedule(principal, annualRatePct, months);
  const cfs = [principal - upfrontFee, ...s.rows.map((r) => -(r.payment + monthlyFee))];
  const irr = monthlyIrr(cfs);
  return {
    netDisbursed: principal - upfrontFee,
    monthlyOutflow: s.payment + monthlyFee,
    irrMonthly: irr,
    apr: irr * 12,
    eir: Math.pow(1 + irr, 12) - 1,
  };
}

export interface EarlySettlement {
  /** Instalments already paid before settling (0 = settle before the first instalment). */
  paidInstalments: number;
  /** Total of the instalments already paid. */
  paidSoFar: number;
  /** Outstanding principal right after the last paid instalment. */
  outstandingPrincipal: number;
  /** Interest accrued since the last due date, 30/360: balance × rate / 360 × days. */
  accruedInterest: number;
  /** Prepayment fee: feePct % of the outstanding principal. */
  prepaymentFee: number;
  /** Amount to pay today to close the loan. */
  settlementAmount: number;
  /** Instalments that would still be paid if the schedule were followed. */
  remainingScheduled: number;
  /** Interest still in the schedule after the last paid instalment. */
  remainingScheduledInterest: number;
  /** remainingScheduled - settlementAmount: what the borrower saves by settling now. */
  borrowerSaving: number;
}

/**
 * Early settlement of an instalment loan (Chương 2, Bài 1; Chương 5, mục 5.3).
 * The borrower has paid `paidInstalments` instalments and settles `days` days
 * (0-30, 30/360 convention) after the last due date. Interest accrued over those
 * days and the prepayment fee are rounded HALF_UP to whole VND.
 */
export function earlySettlement(
  principal: number,
  annualRatePct: number,
  months: number,
  paidInstalments: number,
  days: number,
  feePct: number,
): EarlySettlement {
  const s = amortizationSchedule(principal, annualRatePct, months);
  const k = Math.max(0, Math.min(paidInstalments, s.rows.length - 1));
  const paid = s.rows.slice(0, k);
  const rest = s.rows.slice(k);
  const outstanding = k === 0 ? principal : paid[k - 1].closingBalance;
  const cp = toCentiPercent(annualRatePct);
  // outstanding * (cp / 10000) / 360 * days = outstanding * cp * days / 3_600_000
  const accrued = Number(roundHalfUp(BigInt(outstanding) * cp * BigInt(Math.round(days)), 3_600_000n));
  const fee = Number(roundHalfUp(BigInt(outstanding) * BigInt(Math.round(feePct * 100)), 10_000n));
  const settlementAmount = outstanding + accrued + fee;
  const remainingScheduled = rest.reduce((t, r) => t + r.payment, 0);
  return {
    paidInstalments: k,
    paidSoFar: paid.reduce((t, r) => t + r.payment, 0),
    outstandingPrincipal: outstanding,
    accruedInterest: accrued,
    prepaymentFee: fee,
    settlementAmount,
    remainingScheduled,
    remainingScheduledInterest: rest.reduce((t, r) => t + r.interest, 0),
    borrowerSaving: remainingScheduled - settlementAmount,
  };
}

const vnd = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});
export const formatVnd = (n: number): string => vnd.format(n);
export const formatPct = (x: number, digits = 2): string =>
  `${(x * 100).toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits})}%`;
