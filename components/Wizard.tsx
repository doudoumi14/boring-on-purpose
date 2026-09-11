"use client";

import { countries } from "@/lib/countries";
import type { RiskTolerance } from "@/lib/finance";
import { scoreRisk } from "@/lib/finance";
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

const RISK_QUESTIONS = [
  {
    prompt: "Your savings drop 30% in a year. What do you actually do?",
    options: [
      { label: "Sell — I could not watch that happen", score: 1 },
      { label: "Sit tight and wait it out", score: 2 },
      { label: "Buy more while it is cheap", score: 3 },
    ],
  },
  {
    prompt: "Which would bother you more?",
    options: [
      { label: "Watching my pot fall sharply for a year or two", score: 1 },
      { label: "They bother me about equally", score: 2 },
      { label: "Running out of money in my eighties", score: 3 },
    ],
  },
  {
    prompt: "Have you invested through a market crash before?",
    options: [
      { label: "No, and the idea makes me nervous", score: 1 },
      { label: "No, but I think I would cope", score: 2 },
      { label: "Yes, and I stayed invested", score: 3 },
    ],
  },
];

const STEPS = ["Where you are", "Your timeline", "Your money", "Your retirement", "Your nerves"];

export function Wizard({ onComplete }: { onComplete: (a: Answers) => void }) {
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("CA");
  const [currentAge, setCurrentAge] = useState(40);
  const [retirementAge, setRetirementAge] = useState(65);
  const [savings, setSavings] = useState(25000);
  const [monthlyContribution, setMonthlyContribution] = useState(400);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(3000);
  const [statePensionMonthly, setStatePensionMonthly] = useState(0);
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);

  const selected = countries.find((c) => c.code === country)!;

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

  const canAdvance =
    step !== 1 || retirementAge > currentAge;

  return (
    <div className="mx-auto w-full max-w-xl">
      <ol className="mb-6 flex gap-1.5" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1">
            <div
              className={`h-1 rounded-full transition-colors ${i <= step ? "bg-[var(--series-equity)]" : "bg-[var(--gridline)]"}`}
            />
            <span className="sr-only">
              {label}
              {i === step ? " (current)" : ""}
            </span>
          </li>
        ))}
      </ol>

      <p className="mb-1 text-xs tracking-widest text-muted uppercase">
        Step {step + 1} of {STEPS.length}
      </p>

      {step === 0 && (
        <Field
          label="Where do you live?"
          help="This decides which tax-sheltered account you should fill first — the highest-value choice on this page."
        >
          <select
            aria-label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <Field label="How old are you?">
            <NumberInput value={currentAge} onChange={setCurrentAge} min={16} max={100} label="Current age" />
          </Field>
          <Field
            label="When would you like to stop working?"
            help={
              retirementAge <= currentAge
                ? "Your retirement age needs to be later than your current age."
                : `That gives you ${retirementAge - currentAge} years of compounding.`
            }
            invalid={retirementAge <= currentAge}
          >
            <NumberInput
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
        <div className="flex flex-col gap-5">
          <Field label={`How much have you saved or invested so far? (${selected.currency})`}>
            <NumberInput value={savings} onChange={setSavings} min={0} step={1000} label="Current savings" />
          </Field>
          <Field
            label={`How much can you add each month? (${selected.currency})`}
            help="An honest number beats an aspirational one. You can always raise it later."
          >
            <NumberInput
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              step={50}
              label="Monthly contribution"
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <Field
            label={`How much do you want to live on each month once retired? (${selected.currency})`}
            help="In today's money. Think of what your current life costs, minus the mortgage if it will be paid off."
          >
            <NumberInput
              value={desiredMonthlyIncome}
              onChange={setDesiredMonthlyIncome}
              min={0}
              step={250}
              label="Desired monthly income"
            />
          </Field>
          <Field
            label={`Expected ${selected.statePension.name}, if you know it (${selected.currency}/month)`}
            help={`Optional. Leave at 0 and anything you receive is a bonus. To check: ${selected.statePension.lookup}.`}
          >
            <NumberInput
              value={statePensionMonthly}
              onChange={setStatePensionMonthly}
              min={0}
              step={100}
              label="State pension"
            />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          {RISK_QUESTIONS.map((q, qi) => (
            <fieldset key={q.prompt} className="border-0 p-0">
              <legend className="mb-2 font-medium">{q.prompt}</legend>
              <div className="flex flex-col gap-2">
                {q.options.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => {
                      const next = [...riskAnswers];
                      next[qi] = o.score;
                      setRiskAnswers(next);
                      if (next.filter(Boolean).length === RISK_QUESTIONS.length) finish(next);
                    }}
                    aria-pressed={riskAnswers[qi] === o.score}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      riskAnswers[qi] === o.score
                        ? "border-[var(--series-equity)] bg-[var(--accent-soft)]"
                        : "border-[var(--border)] hover:border-[var(--series-equity)]"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      )}

      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost">
            Back
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance}
            className="btn-primary disabled:opacity-40"
          >
            Continue
          </button>
        )}
      </div>
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
    <label className="block">
      <span className="mb-2 block font-medium">{label}</span>
      {children}
      {help && (
        <span className={`mt-2 block text-sm ${invalid ? "text-[var(--loss)]" : "text-muted"}`}>
          {help}
        </span>
      )}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      className="input"
    />
  );
}
