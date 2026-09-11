import { describe, expect, it } from "vitest";
import {
  ASSUMPTIONS,
  blendedRealReturn,
  buildPlan,
  feeComparison,
  monthlyRate,
  projectBalance,
  projectSeries,
  recommendAllocation,
  requiredMonthlyContribution,
  scoreRisk,
  targetCapital,
} from "./finance";

describe("monthlyRate", () => {
  it("compounds to the annual rate over twelve months", () => {
    const r = monthlyRate(0.05);
    expect(Math.pow(1 + r, 12) - 1).toBeCloseTo(0.05, 10);
  });

  it("is not a naive annual/12", () => {
    expect(monthlyRate(0.12)).toBeLessThan(0.01);
  });
});

describe("targetCapital", () => {
  it("applies the 4% rule: 25x annual spending", () => {
    // $4,000/mo = $48,000/yr; at 4% that needs $1.2M.
    expect(targetCapital({ desiredMonthlyIncome: 4000 })).toBeCloseTo(1_200_000, 6);
  });

  it("subtracts a state pension before sizing the pot", () => {
    // Only $2,000/mo has to come from savings.
    expect(
      targetCapital({ desiredMonthlyIncome: 4000, statePensionMonthly: 2000 }),
    ).toBeCloseTo(600_000, 6);
  });

  it("never returns a negative target when the pension covers everything", () => {
    expect(targetCapital({ desiredMonthlyIncome: 1000, statePensionMonthly: 2500 })).toBe(0);
  });
});

describe("projectBalance", () => {
  it("leaves a lump sum to compound when nothing is added", () => {
    const out = projectBalance({
      current: 10_000,
      monthlyContribution: 0,
      years: 10,
      annualReturn: 0.05,
    });
    // 10,000 * 1.05^10 = 16,288.95
    expect(out).toBeCloseTo(16_288.95, 0);
  });

  it("matches the closed-form annuity for contributions only", () => {
    const years = 10;
    const monthly = 500;
    const annual = 0.06;
    const r = monthlyRate(annual);
    const n = years * 12;
    const expected = monthly * ((Math.pow(1 + r, n) - 1) / r);

    expect(
      projectBalance({ current: 0, monthlyContribution: monthly, years, annualReturn: annual }),
    ).toBeCloseTo(expected, 6);
  });

  it("is just the sum of contributions at a zero return", () => {
    expect(
      projectBalance({ current: 1000, monthlyContribution: 100, years: 2, annualReturn: 0 }),
    ).toBeCloseTo(1000 + 100 * 24, 6);
  });

  it("returns the starting balance when there is no time left", () => {
    expect(
      projectBalance({ current: 5000, monthlyContribution: 900, years: 0, annualReturn: 0.05 }),
    ).toBe(5000);
  });
});

describe("requiredMonthlyContribution", () => {
  it("is the inverse of projectBalance", () => {
    const target = 500_000;
    const args = { current: 25_000, years: 25, annualReturn: 0.05 };
    const monthly = requiredMonthlyContribution({ target, ...args });

    expect(projectBalance({ ...args, monthlyContribution: monthly })).toBeCloseTo(target, 4);
  });

  it("is zero when existing savings already compound past the target", () => {
    expect(
      requiredMonthlyContribution({
        target: 100_000,
        current: 90_000,
        years: 30,
        annualReturn: 0.05,
      }),
    ).toBe(0);
  });

  it("falls back to the raw shortfall when retirement is today", () => {
    expect(
      requiredMonthlyContribution({
        target: 100_000,
        current: 40_000,
        years: 0,
        annualReturn: 0.05,
      }),
    ).toBe(60_000);
  });
});

describe("recommendAllocation", () => {
  it("holds more equity the longer the horizon", () => {
    const far = recommendAllocation({ yearsToRetirement: 35, risk: "balanced" });
    const near = recommendAllocation({ yearsToRetirement: 3, risk: "balanced" });
    expect(far.equity).toBeGreaterThan(near.equity);
  });

  it("always sums to 100", () => {
    for (const years of [0, 1, 7, 20, 45]) {
      for (const risk of ["cautious", "balanced", "adventurous"] as const) {
        const a = recommendAllocation({ yearsToRetirement: years, risk });
        expect(a.equity + a.bonds).toBe(100);
      }
    }
  });

  it("shifts with risk tolerance in the expected direction", () => {
    const years = 15;
    const cautious = recommendAllocation({ yearsToRetirement: years, risk: "cautious" });
    const balanced = recommendAllocation({ yearsToRetirement: years, risk: "balanced" });
    const bold = recommendAllocation({ yearsToRetirement: years, risk: "adventurous" });

    expect(cautious.equity).toBeLessThan(balanced.equity);
    expect(bold.equity).toBeGreaterThan(balanced.equity);
  });

  it("keeps equity inside sane bounds even at the extremes", () => {
    const a = recommendAllocation({ yearsToRetirement: 0, risk: "cautious" });
    const b = recommendAllocation({ yearsToRetirement: 60, risk: "adventurous" });
    expect(a.equity).toBeGreaterThanOrEqual(20);
    expect(b.equity).toBeLessThanOrEqual(95);
  });
});

describe("blendedRealReturn", () => {
  it("returns the pure equity rate at 100% equity", () => {
    expect(blendedRealReturn(100)).toBeCloseTo(ASSUMPTIONS.equityRealReturn, 10);
  });

  it("returns the pure bond rate at 0% equity", () => {
    expect(blendedRealReturn(0)).toBeCloseTo(ASSUMPTIONS.bondRealReturn, 10);
  });

  it("subtracts fees from the blend", () => {
    expect(blendedRealReturn(100, 0.01)).toBeCloseTo(ASSUMPTIONS.equityRealReturn - 0.01, 10);
  });
});

describe("feeComparison", () => {
  it("ranks cheaper fees ahead of dearer ones", () => {
    const [index, advised, active] = feeComparison({
      current: 20_000,
      monthlyContribution: 500,
      years: 30,
      equityPercent: 90,
    });

    expect(index.balance).toBeGreaterThan(advised.balance);
    expect(advised.balance).toBeGreaterThan(active.balance);
    expect(index.lostToFees).toBe(0);
    expect(active.lostToFees).toBeGreaterThan(advised.lostToFees);
  });

  it("shows a 1% fee costing a serious share of the pot over 30 years", () => {
    const [index, advised] = feeComparison({
      current: 0,
      monthlyContribution: 500,
      years: 30,
      equityPercent: 100,
    });
    // Not a precise claim, just the order of magnitude that makes the point.
    expect(advised.lostToFees / index.balance).toBeGreaterThan(0.15);
  });
});

describe("scoreRisk", () => {
  it("maps the quiz extremes to the outer bands", () => {
    expect(scoreRisk([1, 1, 1])).toBe("cautious");
    expect(scoreRisk([3, 3, 3])).toBe("adventurous");
  });

  it("puts the middle in balanced", () => {
    expect(scoreRisk([2, 2, 2])).toBe("balanced");
  });
});

describe("projectSeries", () => {
  it("starts at the current balance and ends at the projected one", () => {
    const args = { current: 10_000, monthlyContribution: 300, years: 20, annualReturn: 0.05 };
    const series = projectSeries(args);

    expect(series[0]).toEqual({ year: 0, balance: 10_000 });
    expect(series.at(-1)!.balance).toBeCloseTo(projectBalance(args), 6);
  });

  it("increases monotonically with a positive return and contributions", () => {
    const series = projectSeries({
      current: 1000,
      monthlyContribution: 100,
      years: 10,
      annualReturn: 0.05,
    });
    for (let i = 1; i < series.length; i++) {
      expect(series[i].balance).toBeGreaterThan(series[i - 1].balance);
    }
  });
});

describe("buildPlan", () => {
  const base = {
    currentAge: 35,
    retirementAge: 65,
    savings: 40_000,
    monthlyContribution: 600,
    desiredMonthlyIncome: 3500,
    risk: "balanced" as const,
  };

  it("produces a coherent plan for a typical saver", () => {
    const plan = buildPlan(base);
    expect(plan.yearsToRetirement).toBe(30);
    expect(plan.target).toBeCloseTo((3500 * 12) / 0.04, 6);
    expect(plan.allocation.equity + plan.allocation.bonds).toBe(100);
    expect(plan.series).toHaveLength(31);
    expect(plan.fees).toHaveLength(3);
  });

  it("flags someone already on track", () => {
    const plan = buildPlan({ ...base, savings: 900_000, desiredMonthlyIncome: 2000 });
    expect(plan.onTrack).toBe(true);
    expect(plan.requiredMonthly).toBe(0);
  });

  it("asks for more when the plan falls short", () => {
    const plan = buildPlan({ ...base, savings: 0, monthlyContribution: 50 });
    expect(plan.onTrack).toBe(false);
    expect(plan.requiredMonthly).toBeGreaterThan(50);
  });

  it("handles someone at retirement age without dividing by zero", () => {
    const plan = buildPlan({ ...base, currentAge: 65 });
    expect(plan.yearsToRetirement).toBe(0);
    expect(Number.isFinite(plan.requiredMonthly)).toBe(true);
    expect(plan.series).toHaveLength(1);
  });

  it("lets a state pension shrink the target", () => {
    const without = buildPlan(base);
    const with_ = buildPlan({ ...base, statePensionMonthly: 1500 });
    expect(with_.target).toBeLessThan(without.target);
  });
});
