"use client";

import type { Lang } from "@/lib/i18n";

export function LanguageToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border border-[var(--border)] p-0.5"
      role="group"
      aria-label="Language / Langue"
    >
      {(["en", "fr"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            lang === code
              ? "bg-[var(--series-equity)] text-white"
              : "text-[var(--muted-ink)] hover:text-[var(--ink)]"
          }`}
        >
          {code === "en" ? "EN" : "FR"}
        </button>
      ))}
    </div>
  );
}
