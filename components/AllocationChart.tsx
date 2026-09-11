"use client";

import type { Dict } from "@/lib/i18n";

/**
 * Two shares of one whole. A single stacked bar rather than a donut: with two
 * categories a bar is read by length instead of angle, and the direct labels
 * sit inside the segments, so identity never rests on colour alone.
 */
export function AllocationChart({
  t,
  equity,
  bonds,
}: {
  t: Dict;
  equity: number;
  bonds: number;
}) {
  const gap = 0.6; // percent of width — the surface spacer between fills

  return (
    <figure className="m-0">
      <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">{t.charts.allocationTitle}</span>
        <span className="text-xs text-muted">{t.charts.allocationSub}</span>
      </figcaption>

      <div
        className="flex h-14 w-full overflow-hidden rounded-lg"
        role="img"
        aria-label={`${equity}% ${t.charts.stocks}, ${bonds}% ${t.charts.bonds}`}
      >
        <div
          className="flex items-center justify-start rounded-l-lg bg-[var(--series-equity)] pl-3 transition-[width] duration-500"
          style={{ width: `${equity - gap}%` }}
        >
          {equity >= 24 && (
            <span className="text-sm font-semibold text-white">
              {equity}% {t.charts.stocks}
            </span>
          )}
        </div>
        <div style={{ width: `${gap * 2}%` }} />
        <div
          className="flex items-center justify-start rounded-r-lg bg-[var(--series-bonds)] pl-3 transition-[width] duration-500"
          style={{ width: `${bonds - gap}%` }}
        >
          {bonds >= 24 && (
            <span className="text-sm font-semibold text-white">
              {bonds}% {t.charts.bonds}
            </span>
          )}
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--series-equity)]" aria-hidden />
          <span className="text-secondary">
            <strong className="tabular-nums">{equity}%</strong> {t.charts.stocksLong}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-[var(--series-bonds)]" aria-hidden />
          <span className="text-secondary">
            <strong className="tabular-nums">{bonds}%</strong> {t.charts.bondsLong}
          </span>
        </li>
      </ul>
    </figure>
  );
}
