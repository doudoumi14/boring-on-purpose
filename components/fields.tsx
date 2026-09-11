"use client";

import type { Dict } from "@/lib/i18n";
import { useState } from "react";

/**
 * Typing a number into a box is the most intimidating thing on a page like
 * this: it is an empty field with no hint of what a reasonable answer looks
 * like. A slider plus a few presets removes that — you can answer without
 * knowing where to start, and the big formatted readout shows the result as
 * money rather than digits. The exact-entry box stays for anyone who has a
 * precise figure in mind.
 */
export function AmountField({
  t,
  value,
  onChange,
  max,
  step,
  presets,
  money,
  suffix,
}: {
  t: Dict;
  value: number;
  onChange: (v: number) => void;
  max: number;
  step: number;
  presets: number[];
  money: (v: number) => string;
  suffix?: string;
}) {
  const [showExact, setShowExact] = useState(false);

  return (
    <div>
      <p className="text-3xl font-bold tabular-nums sm:text-4xl">
        {money(value)}
        {suffix && <span className="ml-2 text-base font-normal text-muted">{suffix}</span>}
      </p>

      <input
        type="range"
        aria-label={t.wizard.quickPick}
        min={0}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-4"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={value === p}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              value === p
                ? "border-[var(--series-equity)] bg-[var(--accent-soft)] text-[var(--series-equity)]"
                : "border-[var(--border)] hover:border-[var(--series-equity)]"
            }`}
          >
            {money(p)}
          </button>
        ))}
      </div>

      {showExact ? (
        <ExactInput value={value} onChange={onChange} label={t.wizard.typeExact} />
      ) : (
        <button
          type="button"
          onClick={() => setShowExact(true)}
          className="mt-3 text-sm text-muted underline hover:text-[var(--series-equity)]"
        >
          {t.wizard.typeExact}
        </button>
      )}
    </div>
  );
}

export function AgeField({
  t,
  value,
  onChange,
  min,
  max,
  label,
}: {
  t: Dict;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-3xl font-bold tabular-nums sm:text-4xl">{t.wizard.yearsOld(value)}</p>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-4"
      />
      <div className="mt-1 flex justify-between text-xs text-muted tabular-nums">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/**
 * Holds a draft string rather than the number. Storing the number meant an
 * empty field was coerced straight back to "0", so it could never be cleared —
 * and digits typed afterwards queued behind the stuck zero, turning 1,2,3,4
 * into "01234".
 */
function ExactInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [draft, setDraft] = useState(value === 0 ? "" : String(value));

  return (
    <input
      type="number"
      inputMode="numeric"
      autoFocus
      aria-label={label}
      value={draft}
      placeholder="0"
      min={0}
      onChange={(e) => {
        // Drop a leading zero only when a real digit follows, so typing into a
        // zeroed field replaces it rather than prefixing it.
        const cleaned = e.target.value.replace(/^0+(?=\d)/, "");
        setDraft(cleaned);
        onChange(cleaned === "" ? 0 : Number(cleaned));
      }}
      className="input mt-3"
    />
  );
}
