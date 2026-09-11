import type { Country } from "@/lib/countries";
import type { Dict } from "@/lib/i18n";

/**
 * The criteria matter more than the names. Anyone can copy a ticker; the point
 * is to leave with a test they can apply to whatever their own bank puts in
 * front of them.
 */
export function WhatToBuy({
  t,
  country,
}: {
  t: Dict;
  country: Country & { inCountry: string };
}) {
  return (
    <section className="card">
      <h3 className="text-lg font-semibold">{t.buy.title}</h3>
      <p className="mt-2 text-sm text-secondary">{t.buy.lede(country.inCountry)}</p>

      <ul className="mt-5 flex flex-col gap-3">
        {country.examples.map((f) => (
          <li
            key={f.name}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">{f.name}</span>
              {f.ticker && (
                <code className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-xs font-semibold text-[var(--series-equity)]">
                  {f.ticker}
                </code>
              )}
            </div>
            <p className="mt-1 text-sm text-secondary">{f.note}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-xl border border-[var(--series-bonds)]/40 bg-[var(--surface-2)] p-4">
        <p className="text-sm font-semibold text-[var(--series-bonds)]">
          {t.buy.trap(country.inCountry)}
        </p>
        <p className="mt-1 text-sm text-secondary">{country.pitfall}</p>
      </div>

      <h4 className="mt-8 font-semibold">{t.buy.criteriaTitle}</h4>
      <p className="mt-1 text-sm text-secondary">{t.buy.criteriaLede}</p>
      <ol className="mt-4 flex flex-col gap-3">
        {t.buy.criteria.map((c, i) => (
          <li key={c.test} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--series-equity)]">
              {i + 1}
            </span>
            <span>
              <strong className="block text-sm">{c.test}</strong>
              <span className="text-sm text-secondary">{c.why}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-sm text-muted">{t.buy.closing}</p>
    </section>
  );
}
