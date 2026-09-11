"use client";

import type { FeeScenario } from "@/lib/finance";

/**
 * Same plan, three fee levels. Each bar is split into what you keep and what
 * the fee takes, so the loss is a visible piece of the same whole rather than a
 * number in a footnote. The fee slice carries an explicit label — colour never
 * has to be decoded on its own.
 */
export function FeeChart({
  scenarios,
  money,
}: {
  scenarios: FeeScenario[];
  money: (v: number, opts?: { compact?: boolean }) => string;
}) {
  const max = Math.max(...scenarios.map((s) => s.balance + s.lostToFees));

  return (
    <figure className="m-0">
      <figcaption className="mb-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">What fees cost you</span>
        <span className="text-xs text-muted">Identical investments, identical returns</span>
      </figcaption>
      <p className="mb-4 text-sm text-secondary">
        The only difference between these three is the annual charge. Nobody is picking better
        investments — the gap is pure cost.
      </p>

      <ul className="flex flex-col gap-4">
        {scenarios.map((s) => {
          const keepPct = (s.balance / max) * 100;
          const lostPct = (s.lostToFees / max) * 100;
          return (
            <li key={s.label}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium">
                  {s.label}{" "}
                  <span className="text-muted tabular-nums">
                    ({(s.fee * 100).toFixed(2)}% a year)
                  </span>
                </span>
                <span className="text-sm font-semibold tabular-nums">{money(s.balance)}</span>
              </div>

              <div className="flex h-7 w-full items-stretch">
                <div
                  className="rounded-l-md bg-[var(--series-equity)]"
                  style={{ width: `${keepPct}%` }}
                />
                {lostPct > 0 && (
                  <>
                    <div className="w-[2px] bg-[var(--surface-1)]" />
                    <div
                      className="rounded-r-md bg-[var(--loss)]"
                      style={{ width: `${lostPct}%` }}
                    />
                  </>
                )}
              </div>

              {s.lostToFees > 0 && (
                <p className="mt-1 text-sm text-[var(--loss)]">
                  {money(s.lostToFees)} of your money goes to fees
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--series-equity)]" aria-hidden />
          <span className="text-secondary">You keep</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--loss)]" aria-hidden />
          <span className="text-secondary">Taken in fees</span>
        </li>
      </ul>
    </figure>
  );
}
