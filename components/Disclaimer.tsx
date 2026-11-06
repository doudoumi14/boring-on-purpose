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
    <p className="inline-flex items-center gap-2 text-sm text-secondary">
      <InfoIcon />
      {t.disclaimer.badge}
    </p>
  );
}

export function DisclaimerPanel({ t }: { t: Dict }) {
  return (
    <aside className="rounded-md border-l-4 border-[var(--series-bonds)] bg-[var(--surface-2)] p-5">
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
