"use client";

import type { FeeScenario } from "@/lib/finance";
import type { Dict } from "@/lib/i18n";

/**
 * Same plan, three fee levels. Each bar is split into what you keep and what
 * the fee takes, so the loss is a visible piece of the same whole rather than a
 * number in a footnote. The fee slice carries an explicit label — colour never
 * has to be decoded on its own.
 */
export function FeeChart({
  t,
  scenarios,
  money,
}: {
  t: Dict;
  scenarios: FeeScenario[];
  money: (v: number, opts?: { compact?: boolean }) => string;
}) {
  const max = Math.max(...scenarios.map((s) => s.balance + s.lostToFees));

  return (
    <figure className="m-0">
      <figcaption className="mb-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">{t.charts.feesTitle}</span>
        <span className="text-xs text-muted">{t.charts.feesSub}</span>
      </figcaption>
      <p className="mb-4 text-sm text-secondary">
        {t.charts.feesLede}
      </p>

      <ul className="flex flex-col gap-4">
        {scenarios.map((s, idx) => {
          const keepPct = (s.balance / max) * 100;
          const lostPct = (s.lostToFees / max) * 100;
          return (
            <li key={s.label}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-sm font-medium">
                  {t.charts.feeNames[idx]}{" "}
                  <span className="text-muted tabular-nums">
                    {t.charts.perYear(`${(s.fee * 100).toFixed(2)}%`)}
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
                  {t.charts.lostToFees(money(s.lostToFees))}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--series-equity)]" aria-hidden />
          <span className="text-secondary">{t.charts.youKeep}</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--loss)]" aria-hidden />
          <span className="text-secondary">{t.charts.takenInFees}</span>
        </li>
      </ul>
    </figure>
  );
}
