import type { Dict } from "@/lib/i18n";

export function Learn({ t }: { t: Dict }) {
  return (
    <section id="why" className="scroll-mt-20">
      <h2 className="text-2xl font-bold sm:text-3xl">{t.learn.title}</h2>
      <p className="mt-2 max-w-2xl text-secondary">{t.learn.lede}</p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {t.learn.lessons.map((l, i) => (
          <li key={l.title} className="card">
            <span className="text-xs font-semibold tabular-nums text-[var(--series-equity)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 font-semibold">{l.title}</h3>
            <p className="mt-2 text-sm text-secondary">{l.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
