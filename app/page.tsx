"use client";

import { DisclaimerBadge } from "@/components/Disclaimer";
import { Hero } from "@/components/Hero";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Learn } from "@/components/Learn";
import { Results } from "@/components/Results";
import { Wizard, type Answers } from "@/components/Wizard";
import { useLanguage } from "@/lib/i18n";
import { useRef, useState } from "react";

type Stage = "intro" | "wizard" | "results";

export default function Home() {
  const { lang, setLang, t } = useLanguage();
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  function start() {
    setStage("wizard");
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-20 px-5 py-8 sm:px-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DisclaimerBadge t={t} />
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>

      <Hero t={t} onStart={start} />

      <div ref={planRef} className="scroll-mt-8">
        {stage === "intro" && (
          <section className="card text-center">
            <h2 className="text-xl font-semibold">{t.intro.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-secondary">{t.intro.body}</p>
            <button type="button" onClick={start} className="btn-primary mt-5">
              {t.intro.start}
            </button>
          </section>
        )}

        {stage === "wizard" && (
          <Wizard
            t={t}
            lang={lang}
            onComplete={(a) => {
              setAnswers(a);
              setStage("results");
              requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth" }));
            }}
          />
        )}

        {stage === "results" && answers && (
          <Results
            t={t}
            lang={lang}
            answers={answers}
            onRestart={() => {
              setAnswers(null);
              setStage("wizard");
            }}
          />
        )}
      </div>

      <Learn t={t} />

      <footer className="border-t border-[var(--border)] pt-8 text-sm text-muted">
        <p className="font-semibold text-secondary">{t.footer.title}</p>
        <p className="mt-2 max-w-3xl">{t.footer.body(t.footer.assumptions)}</p>
        <p className="mt-4">
          {t.footer.builtBy}{" "}
          <a
            className="underline hover:text-[var(--series-equity)]"
            href="https://github.com/doudoumi14"
          >
            Adem Brouri
          </a>
          . {t.footer.openSource} <code className="text-xs">lib/finance.ts</code>{" "}
          {t.footer.andTested}
        </p>
      </footer>
    </main>
  );
}
