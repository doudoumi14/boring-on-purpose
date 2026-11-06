import { DisclaimerBadge } from "@/components/Disclaimer";
import type { Dict } from "@/lib/i18n";

/**
 * The quote carries the thesis on its own. An embedded video was tried here and
 * removed: it pushed the first question below the fold, and asking someone to
 * watch three minutes contradicts the promise in the headline.
 *
 * The notice that this is a learning tool sits above the title, so the framing
 * is set before anyone answers a question.
 */
export function Hero({ t, onStart }: { t: Dict; onStart: () => void }) {
  return (
    <section>
      <DisclaimerBadge t={t} />
      <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold sm:text-6xl">
        {t.hero.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-secondary">{t.hero.lede}</p>

      <blockquote className="mt-8 max-w-2xl border-l-2 border-[var(--series-equity)] pl-5">
        <p className="font-serif text-xl leading-snug italic">&ldquo;{t.hero.quote}&rdquo;</p>
        <footer className="mt-3 text-sm text-muted">
          {t.hero.quoteWho}. {t.hero.quoteWhy}
        </footer>
      </blockquote>

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" onClick={onStart} className="btn-primary text-base">
          {t.hero.cta}
        </button>
        <a
          href="#why"
          className="text-[15px] font-semibold underline decoration-[var(--border)] decoration-2 underline-offset-[0.3em] transition-colors hover:decoration-[var(--ink)]"
        >
          {t.hero.secondary}
        </a>
      </div>
    </section>
  );
}
