"use client";

import { CountUp } from "@/components/CountUp";
import { AgeField, AmountField } from "@/components/fields";
import { countries, getCountry } from "@/lib/countries";
import type { RiskTolerance } from "@/lib/finance";
import { buildPlan, scoreRisk } from "@/lib/finance";
import { formatMoney } from "@/lib/format";
import type { Dict, Lang } from "@/lib/i18n";
import { useState } from "react";

export interface Answers {
  country: string;
  currentAge: number;
  retirementAge: number;
  savings: number;
  monthlyContribution: number;
  desiredMonthlyIncome: number;
  statePensionMonthly: number;
  risk: RiskTolerance;
}

export function Wizard({
  t,
  lang,
  onComplete,
}: {
  t: Dict;
  lang: Lang;
  onComplete: (a: Answers) => void;
}) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("CA");
  const [currentAge, setCurrentAge] = useState(40);
  const [retirementAge, setRetirementAge] = useState(65);
  const [savings, setSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(3000);
  const [statePensionMonthly, setStatePensionMonthly] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);

  const selected = getCountry(country, lang);
  const steps = t.wizard.steps;
  const money = (v: number) =>
    formatMoney(v, { locale: selected.locale, currency: selected.currency });

  function finish(answers: number[]) {
    onComplete({
      country,
      currentAge,
      retirementAge,
      savings,
      monthlyContribution,
      desiredMonthlyIncome,
      statePensionMonthly,
      risk: scoreRisk(answers),
    });
  }

  const canAdvance = step !== 1 || retirementAge > currentAge;

  // Recomputed on every keystroke and drag. The maths is a handful of
  // closed-form formulas, so this is cheap, and seeing the figure move while
  // you drag a slider teaches more than any paragraph about compounding.
  const preview =
    retirementAge > currentAge
      ? buildPlan({
          currentAge,
          retirementAge,
          savings,
          monthlyContribution,
          desiredMonthlyIncome,
          statePensionMonthly,
          risk: "balanced",
        })
      : null;

  return (
    <div className="mx-auto w-full max-w-xl">
      <ol className="mb-5 flex gap-1.5" aria-label="Progress">
        {steps.map((label, i) => (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-[var(--series-equity)]" : "bg-[var(--gridline)]"}`}
            />
            <span className="sr-only">
              {label}
              {i === step ? " (current)" : ""}
            </span>
          </li>
        ))}
      </ol>

      <p className="mb-5 text-xs tracking-widest text-muted uppercase">
        {t.wizard.stepOf(step + 1, steps.length)}
      </p>

      {step === 0 && (
        <Field label={t.wizard.country} help={t.wizard.countryHelp}>
          <select
            aria-label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input text-lg"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {getCountry(c.code, lang).name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-8">
          <Field label={t.wizard.age}>
            <AgeField
              t={t}
              value={currentAge}
              onChange={setCurrentAge}
              min={16}
              max={100}
              label="Current age"
            />
          </Field>
          <Field
            label={t.wizard.retireAge}
            help={
              retirementAge <= currentAge
                ? t.wizard.retireInvalid
                : t.wizard.retireYears(retirementAge - currentAge)
            }
            invalid={retirementAge <= currentAge}
          >
            <AgeField
              t={t}
              value={retirementAge}
              onChange={setRetirementAge}
              min={40}
              max={100}
              label="Retirement age"
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-8">
          <Field label={t.wizard.savings(selected.currency)} help={t.wizard.savingsHelp}>
            <AmountField
              t={t}
              value={savings}
              onChange={setSavings}
              max={500000}
              step={1000}
              presets={[0, 10000, 50000, 150000]}
              money={money}
            />
          </Field>
          <Field label={t.wizard.monthly(selected.currency)} help={t.wizard.monthlyHelp}>
            <AmountField
              t={t}
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              max={5000}
              step={25}
              presets={[100, 250, 500, 1000]}
              money={money}
              suffix={t.wizard.perMonth}
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-8">
          <Field label={t.wizard.income(selected.currency)} help={t.wizard.incomeHelp}>
            <AmountField
              t={t}
              value={desiredMonthlyIncome}
              onChange={setDesiredMonthlyIncome}
              max={15000}
              step={100}
              presets={[1500, 2500, 4000, 6000]}
              money={money}
              suffix={t.wizard.perMonth}
            />
          </Field>
          <Field
            label={t.wizard.pension(selected.statePension.name, selected.currency)}
            help={t.wizard.pensionHelp(selected.statePension.lookup)}
          >
            <AmountField
              t={t}
              value={statePensionMonthly}
              onChange={setStatePensionMonthly}
              max={5000}
              step={50}
              presets={[0, 800, 1500, 2500]}
              money={money}
              suffix={t.wizard.perMonth}
            />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-secondary">{t.wizard.riskIntro}</p>
          {t.wizard.risk.map((q, qi) => (
            <fieldset key={q.prompt} className="border-0 p-0">
              <legend className="mb-2 font-medium">{q.prompt}</legend>
              <div className="flex flex-col gap-2">
                {q.options.map((label, oi) => {
                  const score = oi + 1;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const next = [...riskAnswers];
                        next[qi] = score;
                        setRiskAnswers(next);
                        if (next.filter(Boolean).length === t.wizard.risk.length) finish(next);
                      }}
                      aria-pressed={riskAnswers[qi] === score}
                      className={`rounded-xl border px-4 py-3.5 text-left transition ${
                        riskAnswers[qi] === score
                          ? "border-[var(--series-equity)] bg-[var(--accent-soft)]"
                          : "border-[var(--border)] hover:border-[var(--series-equity)]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {preview && step >= 2 && step < 4 && (
        <div className="mt-8 rounded-2xl border border-[var(--series-equity)]/40 bg-[var(--accent-soft)] p-5">
          <p className="text-xs tracking-wider text-muted uppercase">{t.wizard.livePreview}</p>
          <p className="mt-1 text-3xl font-bold text-[var(--series-equity)]">
            <CountUp value={preview.projectedWithCurrentSaving} format={money} durationMs={450} />
          </p>
          <p className="mt-1 text-sm text-secondary">{t.wizard.livePreviewHint}</p>
        </div>
      )}

      {/* A running plain-language recap, so nobody has to remember what they
          already answered or page backwards to check. */}
      {step > 0 && (
        <dl className="mt-8 flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--border)] pt-4 text-xs text-muted">
          <Recap label={steps[0]} value={selected.name} />
          {step > 1 && (
            <Recap
              label={steps[1]}
              value={`${t.wizard.yearsOld(currentAge)} → ${t.wizard.atAge(retirementAge)}`}
            />
          )}
          {step > 2 && (
            <Recap
              label={steps[2]}
              value={`${money(savings)} + ${money(monthlyContribution)} ${t.wizard.perMonth}`}
            />
          )}
          {step > 3 && <Recap label={steps[3]} value={money(desiredMonthlyIncome)} />}
        </dl>
      )}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost">
            {t.wizard.back}
          </button>
        )}
        {step < steps.length - 1 && (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance}
            className="btn-primary disabled:opacity-40"
          >
            {t.wizard.next}
          </button>
        )}
      </div>
    </div>
  );
}

function Recap({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <dt>{label}:</dt>
      <dd className="font-medium text-secondary">{value}</dd>
    </div>
  );
}

function Field({
  label,
  help,
  invalid,
  children,
}: {
  label: string;
  help?: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-lg font-medium">{label}</p>
      {children}
      {help && (
        <p className={`mt-3 text-sm ${invalid ? "text-[var(--loss)]" : "text-muted"}`}>{help}</p>
      )}
    </div>
  );
}
