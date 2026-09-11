"use client";

import { Hero } from "@/components/Hero";
import { Learn } from "@/components/Learn";
import { Results } from "@/components/Results";
import { Wizard, type Answers } from "@/components/Wizard";
import { useRef, useState } from "react";

type Stage = "intro" | "wizard" | "results";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const planRef = useRef<HTMLDivElement>(null);

  function start() {
    setStage("wizard");
    requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-20 px-5 py-12 sm:px-8 sm:py-16">
      <Hero onStart={start} />

      <div ref={planRef} className="scroll-mt-8">
        {stage === "intro" && (
          <section className="card text-center">
            <h2 className="text-xl font-semibold">Five questions. No signup, no email.</h2>
            <p className="mx-auto mt-2 max-w-md text-secondary">
              Everything is worked out in your browser. Nothing you type is sent anywhere or stored.
            </p>
            <button type="button" onClick={start} className="btn-primary mt-5">
              Start
            </button>
          </section>
        )}

        {stage === "wizard" && (
          <Wizard
            onComplete={(a) => {
              setAnswers(a);
              setStage("results");
              requestAnimationFrame(() => planRef.current?.scrollIntoView({ behavior: "smooth" }));
            }}
          />
        )}

        {stage === "results" && answers && (
          <Results
            answers={answers}
            onRestart={() => {
              setAnswers(null);
              setStage("wizard");
            }}
          />
        )}
      </div>

      <Learn />

      <footer className="border-t border-[var(--border)] pt-8 text-sm text-muted">
        <p className="font-semibold text-secondary">This is education, not financial advice.</p>
        <p className="mt-2 max-w-3xl">
          Boring on Purpose is not a licensed financial advisor and knows nothing about your
          circumstances beyond the five answers you gave. The projections use long-run historical
          real returns — {""}
          5% a year for equities and 1.5% for bonds, after inflation — and the 4% withdrawal rule.
          Those are planning assumptions, not promises: real markets do not deliver an even 5% a
          year, and your own results will differ. Tax rules vary by country and change. Before
          acting on anything here, check it against your own situation, and consider a fee-only
          advisor who charges a flat fee rather than a percentage of your savings.
        </p>
        <p className="mt-4">
          Built by{" "}
          <a
            className="underline hover:text-[var(--series-equity)]"
            href="https://github.com/doudoumi14"
          >
            Adem Brouri
          </a>
          . Open source — the maths lives in{" "}
          <code className="text-xs">lib/finance.ts</code> and is covered by tests.
        </p>
      </footer>
    </main>
  );
}
