"use client";

import { AllocationChart } from "@/components/AllocationChart";
import { FeeChart } from "@/components/FeeChart";
import { ProjectionChart } from "@/components/ProjectionChart";
import type { Answers } from "@/components/Wizard";
import { getCountry } from "@/lib/countries";
import { buildPlan } from "@/lib/finance";
import { formatMoney } from "@/lib/format";

export function Results({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const country = getCountry(answers.country);
  const plan = buildPlan(answers);
  const money = (v: number, opts?: { compact?: boolean }) =>
    formatMoney(v, { locale: country.locale, currency: country.currency }, opts);

  const shortfall = Math.max(0, plan.requiredMonthly - answers.monthlyContribution);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <p className="text-xs tracking-widest text-muted uppercase">Your plan</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          {plan.onTrack ? "You are on track." : "Here is the gap, and how to close it."}
        </h2>
        <p className="mt-3 max-w-2xl text-secondary">
          To draw {money(answers.desiredMonthlyIncome)} a month for life, you need about{" "}
          <strong>{money(plan.target)}</strong> by age {answers.retirementAge} — in today&rsquo;s
          money, so it is directly comparable to what things cost now.
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Target pot" value={money(plan.target)} />
          <Stat
            label="On your current saving"
            value={money(plan.projectedWithCurrentSaving)}
            tone={plan.onTrack ? "good" : "warn"}
          />
          <Stat
            label={shortfall > 0 ? "Add each month" : "Needed each month"}
            value={money(plan.requiredMonthly)}
            tone={shortfall > 0 ? "warn" : "good"}
          />
        </dl>

        {shortfall > 0 && (
          <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
            You are putting away {money(answers.monthlyContribution)} a month. Raising that to{" "}
            <strong>{money(plan.requiredMonthly)}</strong> closes the gap — a difference of{" "}
            {money(shortfall)} a month. If that is not possible right now, working a year or two
            longer moves this number a surprising amount.
          </p>
        )}
      </section>

      <section className="card">
        <AllocationChart equity={plan.allocation.equity} bonds={plan.allocation.bonds} />
        <p className="mt-4 text-sm text-secondary">
          You have {plan.yearsToRetirement} years. That is the main reason for this split — time is
          what makes stock-market risk survivable, so a long horizon earns a high equity share and a
          short one does not. Your answers about volatility nudged it from there.
        </p>
        <p className="mt-3 text-sm text-secondary">
          <strong>Stocks</strong> here means one broad-market index fund holding thousands of
          companies — not individually chosen shares. {country.fundGuidance}
        </p>
      </section>

      <section className="card">
        <ProjectionChart
          series={plan.series}
          target={plan.target}
          currentAge={answers.currentAge}
          money={money}
        />
      </section>

      <section className="card">
        <FeeChart scenarios={plan.fees} money={money} />
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">Do this, in this order</h3>
        <ol className="mt-4 flex flex-col gap-4">
          {country.accounts.map((a, i) => (
            <li key={a.name} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--series-equity)]">
                {i + 1}
              </span>
              <span>
                <strong className="block">{a.name}</strong>
                <span className="text-sm text-secondary">{a.note}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-secondary">
          Then set up an automatic monthly transfer and stop looking. Checking daily makes people
          sell at the worst moment; that is the main way ordinary investors lose money.
        </p>
      </section>

      <button type="button" onClick={onRestart} className="btn-ghost self-start">
        Start over
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warn";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <dt className="text-xs tracking-wider text-muted uppercase">{label}</dt>
      <dd
        className={`mt-1 text-2xl font-bold ${
          tone === "good" ? "text-[var(--good)]" : tone === "warn" ? "text-[var(--loss)]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
