import type { Dict } from "@/lib/i18n";

export function Learn({ t }: { t: Dict }) {
  return (
    <section id="why" className="scroll-mt-20">
      <h2 className="text-3xl font-semibold sm:text-4xl">{t.learn.title}</h2>
      <p className="mt-3 max-w-2xl text-secondary">{t.learn.lede}</p>

      <ul className="mt-8 grid gap-x-10 border-t-2 border-[var(--ink)] sm:grid-cols-2">
        {t.learn.lessons.map((l) => (
          <li key={l.title} className="border-b border-[var(--border)] py-6">
            <h3 className="font-semibold">{l.title}</h3>
            <p className="mt-2 text-secondary">{l.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
