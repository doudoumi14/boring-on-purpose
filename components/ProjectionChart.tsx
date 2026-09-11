"use client";

import type { Dict } from "@/lib/i18n";
import { useState } from "react";

interface Point {
  year: number;
  balance: number;
}

/**
 * Balance over time against the target. One measure, one axis — the target is a
 * reference line on the same scale, never a second y-axis.
 */
export function ProjectionChart({
  t,
  series,
  range,
  target,
  currentAge,
  money,
}: {
  t: Dict;
  series: Point[];
  range: { low: number; high: number };
  target: number;
  currentAge: number;
  money: (v: number, opts?: { compact?: boolean }) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 680;
  const H = 260;
  const PAD = { top: 16, right: 16, bottom: 30, left: 56 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const lastYear = series.at(-1)?.year ?? 1;
  const maxValue = Math.max(target, range.high, ...series.map((p) => p.balance)) * 1.08;

  const x = (year: number) => PAD.left + (year / Math.max(1, lastYear)) * plotW;
  const y = (value: number) => PAD.top + plotH - (value / maxValue) * plotH;

  const line = series.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.balance)}`).join(" ");
  const area = `${line} L ${x(lastYear)} ${PAD.top + plotH} L ${x(0)} ${PAD.top + plotH} Z`;

  const ticks = [0, 0.5, 1].map((t) => Math.round(lastYear * t));
  const valueTicks = [0, maxValue / 2, maxValue];

  const active = hover === null ? null : series[hover];

  return (
    <figure className="m-0">
      <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-sm font-semibold">{t.charts.projectionTitle}</span>
        <span className="text-xs text-muted">{t.charts.projectionSub}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Projected balance from age ${currentAge} to ${currentAge + lastYear}, ending at ${money(series.at(-1)?.balance ?? 0)} against a target of ${money(target)}`}
        onMouseLeave={() => setHover(null)}
      >
        {valueTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--gridline)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(v) + 4}
              textAnchor="end"
              className="fill-[var(--muted-ink)] text-[11px] tabular-nums"
            >
              {money(v, { compact: true })}
            </text>
          </g>
        ))}

        {/* The band is the honest part: a single line implies a precision that
            no projection has. */}
        <path
          d={`${series
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.balance * (range.high / Math.max(1, series.at(-1)!.balance)))}`,
            )
            .join(" ")} ${series
            .slice()
            .reverse()
            .map(
              (p) =>
                `L ${x(p.year)} ${y(p.balance * (range.low / Math.max(1, series.at(-1)!.balance)))}`,
            )
            .join(" ")} Z`}
          fill="var(--series-equity)"
          opacity={0.13}
        />
        <path d={area} fill="var(--series-equity)" opacity={0.08} />
        <path d={line} fill="none" stroke="var(--series-equity)" strokeWidth={2} strokeLinejoin="round" />

        {/* Target: a reference line on the same scale, labelled directly. */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={y(target)}
          y2={y(target)}
          stroke="var(--series-bonds)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={W - PAD.right}
          y={y(target) - 7}
          textAnchor="end"
          className="fill-[var(--series-bonds)] text-[11px] font-semibold"
        >
          {t.charts.target} {money(target, { compact: true })}
        </text>

        {ticks.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={H - 8}
            textAnchor={t === 0 ? "start" : t === lastYear ? "end" : "middle"}
            className="fill-[var(--muted-ink)] text-[11px] tabular-nums"
          >
            age {currentAge + t}
          </text>
        ))}

        {active && (
          <g>
            <line
              x1={x(active.year)}
              x2={x(active.year)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--muted-ink)"
              strokeWidth={1}
            />
            <circle
              cx={x(active.year)}
              cy={y(active.balance)}
              r={5}
              fill="var(--series-equity)"
              stroke="var(--surface-1)"
              strokeWidth={2}
            />
          </g>
        )}

        {/* Generous invisible hit targets, wider than the marks. */}
        {series.map((p, i) => (
          <rect
            key={p.year}
            x={x(p.year) - plotW / Math.max(1, series.length) / 2}
            y={PAD.top}
            width={plotW / Math.max(1, series.length)}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      <p className="mt-1 h-5 text-sm text-secondary" aria-live="polite">
        {active
          ? t.charts.atAge(currentAge + active.year, money(active.balance))
          : t.charts.hoverHint}
      </p>
    </figure>
  );
}
