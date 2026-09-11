"use client";

import { AllocationChart } from "@/components/AllocationChart";
import { FeeChart } from "@/components/FeeChart";
import { ProjectionChart } from "@/components/ProjectionChart";
import { WhatToBuy } from "@/components/WhatToBuy";
import type { Answers } from "@/components/Wizard";
import { getCountry } from "@/lib/countries";
import { buildPlan } from "@/lib/finance";
import { formatMoney } from "@/lib/format";
import type { Dict, Lang } from "@/lib/i18n";

export function Results({
  t,
  lang,
  answers,
  onRestart,
}: {
  t: Dict;
  lang: Lang;
  answers: Answers;
  onRestart: () => void;
}) {
  const country = getCountry(answers.country, lang);
  const plan = buildPlan(answers);
  // The number format follows the country, not the interface language: a
  // Canadian reading in French still wants Canadian dollars.
  const money = (v: number, opts?: { compact?: boolean }) =>
    formatMoney(v, { locale: country.locale, currency: country.currency }, opts);

  const shortfall = Math.max(0, plan.requiredMonthly - answers.monthlyContribution);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <p className="text-xs tracking-widest text-muted uppercase">{t.results.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          {plan.onTrack ? t.results.onTrack : t.results.gap}
        </h2>
        <p className="mt-3 max-w-2xl text-secondary">
          {t.results.summary(
            money(answers.desiredMonthlyIncome),
            money(plan.target),
            answers.retirementAge,
          )}
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label={t.results.targetLabel} value={money(plan.target)} />
          <Stat
            label={t.results.projectedLabel}
            value={money(plan.projectedWithCurrentSaving)}
            tone={plan.onTrack ? "good" : "warn"}
          />
          <Stat
            label={t.results.addLabel}
            value={money(plan.requiredMonthly)}
            tone={shortfall > 0 ? "warn" : "good"}
          />
        </dl>

        {shortfall > 0 && (
          <p className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm">
            {t.results.shortfall(
              money(answers.monthlyContribution),
              money(plan.requiredMonthly),
              money(shortfall),
            )}
          </p>
        )}
      </section>

      <section className="card">
        <AllocationChart t={t} equity={plan.allocation.equity} bonds={plan.allocation.bonds} />
        <p className="mt-4 text-sm text-secondary">
          {t.results.allocationWhy(plan.yearsToRetirement)}
        </p>
        <p className="mt-3 text-sm text-secondary">
          {t.results.allocationWhat} {country.fundGuidance}
        </p>
      </section>

      <WhatToBuy t={t} country={country} />

      <section className="card">
        <ProjectionChart
          t={t}
          series={plan.series}
          target={plan.target}
          currentAge={answers.currentAge}
          money={money}
        />
      </section>

      <section className="card">
        <FeeChart t={t} scenarios={plan.fees} money={money} />
      </section>

      <section className="card">
        <h3 className="text-lg font-semibold">{t.results.orderTitle}</h3>
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
        <p className="mt-5 text-sm text-secondary">{t.results.orderEnd}</p>
      </section>

      <button type="button" onClick={onRestart} className="btn-ghost self-start">
        {t.results.restart}
      </button>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "warn" }) {
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
