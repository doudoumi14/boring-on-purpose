"use client";

import type { Lang } from "@/lib/i18n";

// One link to the other language, named in that language: the convention of
// bilingual Canadian sites, and one control instead of a two-state pill.
export function LanguageToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  const other: Lang = lang === "en" ? "fr" : "en";
  return (
    <button
      type="button"
      lang={other}
      onClick={() => onChange(other)}
      className="text-[15px] font-semibold underline decoration-[var(--border)] decoration-2 underline-offset-[0.3em] transition-colors hover:decoration-[var(--ink)]"
    >
      {other === "fr" ? "Français" : "English"}
    </button>
  );
}
