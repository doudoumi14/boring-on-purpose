/**
 * Every figure in this file is in REAL terms — today's money, after inflation.
 *
 * That is the single biggest comprehension win in the whole tool. A nominal
 * projection tells a 35-year-old they need $2.4M, which is both true and
 * useless, because they have no intuition for what $2.4M buys in 2056. Quoting
 * the same plan as "$860,000 in today's money" is the number they can actually
 * reason about. The cost is that every return assumption below has to be a real
 * return, so inflation is never added back anywhere.
 */

export const ASSUMPTIONS = {
  /** Long-run real return on a broad global equity index. */
  equityRealReturn: 0.05,
  /** Long-run real return on investment-grade bonds. */
  bondRealReturn: 0.015,
  /**
   * Safe withdrawal rate. 4% is the Trinity-study figure for a 30-year
   * retirement; it is a planning rule of thumb, not a guarantee.
   */
  withdrawalRate: 0.04,
  /** Typical ongoing charge on a broad index fund or ETF. */
  indexFundFee: 0.0005,
  /** Typical all-in cost of an advisor who picks funds for you. */
  advisedFee: 0.01,
  /** Typical actively managed fund. */
  activeFundFee: 0.019,
} as const;

export type RiskTolerance = "cautious" | "balanced" | "adventurous";

/** Converts an annual rate to its monthly equivalent (compounding, not /12). */
export function monthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/** Blended expected real return for a given equity/bond split. */
export function blendedRealReturn(equityPercent: number, feeDrag = 0): number {
  const e = clamp(equityPercent, 0, 100) / 100;
  const gross = e * ASSUMPTIONS.equityRealReturn + (1 - e) * ASSUMPTIONS.bondRealReturn;
  return gross - feeDrag;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * The pot you need on day one of retirement, so that withdrawing
 * `desiredMonthlyIncome` (less any state pension) is sustainable.
 */
export function targetCapital({
  desiredMonthlyIncome,
  statePensionMonthly = 0,
  withdrawalRate = ASSUMPTIONS.withdrawalRate,
}: {
  desiredMonthlyIncome: number;
  statePensionMonthly?: number;
  withdrawalRate?: number;
}): number {
  const shortfall = Math.max(0, desiredMonthlyIncome - statePensionMonthly);
  return (shortfall * 12) / withdrawalRate;
}

/**
 * Future value of a starting balance plus a monthly contribution, compounded
 * monthly. Contributions are treated as arriving at the end of each month.
 */
export function projectBalance({
  current,
  monthlyContribution,
  years,
  annualReturn,
}: {
  current: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
}): number {
  const months = Math.round(years * 12);
  if (months <= 0) return current;

  const r = monthlyRate(annualReturn);
  if (r === 0) return current + monthlyContribution * months;

  const growth = Math.pow(1 + r, months);
  return current * growth + monthlyContribution * ((growth - 1) / r);
}

/** Year-by-year balances, for the projection chart. */
export function projectSeries({
  current,
  monthlyContribution,
  years,
  annualReturn,
}: {
  current: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
}): { year: number; balance: number }[] {
  const points: { year: number; balance: number }[] = [];
  const whole = Math.max(0, Math.ceil(years));
  for (let y = 0; y <= whole; y++) {
    points.push({
      year: y,
      balance: projectBalance({
        current,
        monthlyContribution,
        years: Math.min(y, years),
        annualReturn,
      }),
    });
  }
  return points;
}

/**
 * The monthly contribution needed to reach `target`. Returns 0 when the
 * existing balance already compounds past the target on its own.
 */
export function requiredMonthlyContribution({
  target,
  current,
  years,
  annualReturn,
}: {
  target: number;
  current: number;
  years: number;
  annualReturn: number;
}): number {
  const months = Math.round(years * 12);
  if (months <= 0) return Math.max(0, target - current);

  const r = monthlyRate(annualReturn);
  const growth = Math.pow(1 + r, months);
  const fromExisting = current * growth;
  const gap = target - fromExisting;
  if (gap <= 0) return 0;

  if (r === 0) return gap / months;
  return gap / ((growth - 1) / r);
}

/**
 * Equity weight from the time horizon, then nudged by how much volatility the
 * person says they can live with.
 *
 * The horizon does the heavy lifting on purpose: time in the market is what
 * makes equity risk survivable, so someone 30 years out belongs in equities
 * almost regardless of temperament, and someone two years out does not.
 */
export function recommendAllocation({
  yearsToRetirement,
  risk,
}: {
  yearsToRetirement: number;
  risk: RiskTolerance;
}): { equity: number; bonds: number } {
  const base = clamp(40 + yearsToRetirement * 2.5, 30, 90);
  const nudge = risk === "cautious" ? -15 : risk === "adventurous" ? 10 : 0;
  const equity = Math.round(clamp(base + nudge, 20, 95));
  return { equity, bonds: 100 - equity };
}

/** Maps the three-question quiz to a tolerance band. */
export function scoreRisk(answers: number[]): RiskTolerance {
  const total = answers.reduce((sum, a) => sum + a, 0);
  if (total <= 3) return "cautious";
  if (total <= 6) return "balanced";
  return "adventurous";
}

export interface FeeScenario {
  label: string;
  fee: number;
  balance: number;
  /** Money lost to fees versus the cheapest scenario. */
  lostToFees: number;
}

/**
 * The same plan under different ongoing charges. This is the most persuasive
 * number in the tool: the gap is entirely fees, not skill.
 */
export function feeComparison({
  current,
  monthlyContribution,
  years,
  equityPercent,
}: {
  current: number;
  monthlyContribution: number;
  years: number;
  equityPercent: number;
}): FeeScenario[] {
  const scenarios = [
    { label: "Index fund", fee: ASSUMPTIONS.indexFundFee },
    { label: "Advisor picking funds", fee: ASSUMPTIONS.advisedFee },
    { label: "Actively managed fund", fee: ASSUMPTIONS.activeFundFee },
  ];

  const balances = scenarios.map((s) => ({
    ...s,
    balance: projectBalance({
      current,
      monthlyContribution,
      years,
      annualReturn: blendedRealReturn(equityPercent, s.fee),
    }),
  }));

  const best = Math.max(...balances.map((b) => b.balance));
  return balances.map((b) => ({ ...b, lostToFees: best - b.balance }));
}

export interface Plan {
  yearsToRetirement: number;
  target: number;
  allocation: { equity: number; bonds: number };
  expectedReturn: number;
  projectedWithCurrentSaving: number;
  requiredMonthly: number;
  onTrack: boolean;
  series: { year: number; balance: number }[];
  fees: FeeScenario[];
}

export function buildPlan({
  currentAge,
  retirementAge,
  savings,
  monthlyContribution,
  desiredMonthlyIncome,
  statePensionMonthly = 0,
  risk,
}: {
  currentAge: number;
  retirementAge: number;
  savings: number;
  monthlyContribution: number;
  desiredMonthlyIncome: number;
  statePensionMonthly?: number;
  risk: RiskTolerance;
}): Plan {
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const allocation = recommendAllocation({ yearsToRetirement, risk });
  const expectedReturn = blendedRealReturn(allocation.equity, ASSUMPTIONS.indexFundFee);
  const target = targetCapital({ desiredMonthlyIncome, statePensionMonthly });

  const projectedWithCurrentSaving = projectBalance({
    current: savings,
    monthlyContribution,
    years: yearsToRetirement,
    annualReturn: expectedReturn,
  });

  const requiredMonthly = requiredMonthlyContribution({
    target,
    current: savings,
    years: yearsToRetirement,
    annualReturn: expectedReturn,
  });

  return {
    yearsToRetirement,
    target,
    allocation,
    expectedReturn,
    projectedWithCurrentSaving,
    requiredMonthly,
    onTrack: projectedWithCurrentSaving >= target,
    series: projectSeries({
      current: savings,
      monthlyContribution,
      years: yearsToRetirement,
      annualReturn: expectedReturn,
    }),
    fees: feeComparison({
      current: savings,
      monthlyContribution,
      years: yearsToRetirement,
      equityPercent: allocation.equity,
    }),
  };
}
