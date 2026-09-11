import type { Dict } from "@/lib/i18n";

/**
 * Shown twice on purpose.
 *
 * The badge sits in the header so the framing is set before anyone answers a
 * question. The full notice sits directly above the results, because that is
 * the moment a reader is looking at a concrete figure about their own
 * retirement and is most likely to act on it — a disclaimer only in the footer
 * is one almost nobody scrolls to.
 */
export function DisclaimerBadge({ t }: { t: Dict }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-secondary">
      <InfoIcon />
      {t.disclaimer.badge}
    </span>
  );
}

export function DisclaimerPanel({ t }: { t: Dict }) {
  return (
    <aside className="rounded-2xl border-2 border-[var(--series-bonds)]/50 bg-[var(--series-bonds)]/5 p-5">
      <p className="flex items-center gap-2 font-semibold text-[var(--series-bonds)]">
        <InfoIcon />
        {t.disclaimer.resultsTitle}
      </p>
      <p className="mt-2 text-sm text-secondary">{t.disclaimer.resultsBody}</p>
      <p className="mt-2 text-sm text-secondary">{t.disclaimer.checkFirst}</p>
    </aside>
  );
}

function InfoIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.5" />
    </svg>
  );
}
