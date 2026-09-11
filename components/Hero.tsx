import type { Dict } from "@/lib/i18n";

/**
 * The quote carries the thesis on its own. An embedded video was tried here and
 * removed: it pushed the first question below the fold, and asking someone to
 * watch three minutes contradicts the promise in the headline.
 */
export function Hero({ t, onStart }: { t: Dict; onStart: () => void }) {
  return (
    <section>
      <p className="text-xs tracking-widest text-muted uppercase">{t.hero.eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
        {t.hero.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-secondary">{t.hero.lede}</p>

      <blockquote className="mt-7 max-w-2xl border-l-2 border-[var(--series-equity)] pl-4">
        <p className="text-secondary italic">&ldquo;{t.hero.quote}&rdquo;</p>
        <footer className="mt-2 text-sm text-muted">
          {t.hero.quoteWho}. {t.hero.quoteWhy}
        </footer>
      </blockquote>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onStart} className="btn-primary text-base">
          {t.hero.cta}
        </button>
        <a href="#why" className="btn-ghost">
          {t.hero.secondary}
        </a>
      </div>
    </section>
  );
}
