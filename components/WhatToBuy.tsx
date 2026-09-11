import type { Country } from "@/lib/countries";

/**
 * The criteria matter more than the names. Anyone can copy a ticker; the point
 * is to leave with a test they can apply to whatever their own bank or broker
 * puts in front of them.
 */
const CRITERIA = [
  {
    test: "Does it charge less than about 0.30% a year?",
    why: "Called the ongoing charge, TER, MER or expense ratio depending where you live. Above ~0.5% you are paying for something that does not help you.",
  },
  {
    test: "Does it hold hundreds or thousands of companies?",
    why: "Not a theme, a sector, a country bet or 'AI leaders'. Breadth is the product.",
  },
  {
    test: "Does its name contain All-World, MSCI World, ACWI, S&P 500 or total market?",
    why: "These are the boring broad indices. A creative name is usually a more expensive fund.",
  },
  {
    test: "Has it existed for years and does it hold billions?",
    why: "Large, old and dull means it will still be there in thirty years and will not be quietly shut down.",
  },
  {
    test: "Is there no entry fee, exit fee or performance fee?",
    why: "A front-end load takes a slice before you have earned anything. Never necessary.",
  },
];

export function WhatToBuy({ country }: { country: Country }) {
  return (
    <section className="card">
      <h3 className="text-lg font-semibold">What this actually looks like</h3>
      <p className="mt-2 text-sm text-secondary">
        The hardest part of this advice is usually the gap between &ldquo;buy a broad index
        fund&rdquo; and knowing which button to press. So — examples available in {country.name}.
        These are illustrations of the category, <strong>not recommendations</strong>: within the
        category they are close to interchangeable, which is exactly the point.
      </p>

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
          The trap to avoid in {country.name}
        </p>
        <p className="mt-1 text-sm text-secondary">{country.pitfall}</p>
      </div>

      <h4 className="mt-8 font-semibold">How to recognise a good one yourself</h4>
      <p className="mt-1 text-sm text-secondary">
        Fund names and fees change. These five questions do not — apply them to anything you are
        offered, including by your own bank.
      </p>
      <ol className="mt-4 flex flex-col gap-3">
        {CRITERIA.map((c, i) => (
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

      <p className="mt-6 text-sm text-muted">
        If a fund passes all five, it is almost certainly fine. If someone wants a yearly percentage
        of your savings to choose one for you, that is the fee this whole page is about.
      </p>
    </section>
  );
}
