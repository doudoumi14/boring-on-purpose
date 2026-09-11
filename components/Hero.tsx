"use client";

import { useState } from "react";

/**
 * The Buffett clip is the thesis of the whole site, so it leads.
 *
 * Verified: "Warren Buffett: Buying And Holding Index Funds Has Worked",
 * published by CNBC. Swap BUFFETT_VIDEO_ID to change the clip — it is the only
 * place the id appears.
 *
 * The player is not embedded until the viewer clicks. A cold YouTube iframe
 * costs roughly a megabyte and sets cookies before anyone has asked to watch,
 * which is a poor trade on a page whose promise is "five minutes".
 */
const BUFFETT_VIDEO_ID = "10QoUi2PmNs";
const BUFFETT_TITLE = "Warren Buffett: Buying And Holding Index Funds Has Worked (CNBC)";

export function Hero({ onStart }: { onStart: () => void }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="flex flex-col gap-10 lg:flex-row lg:items-center">
      <div className="flex-1">
        <p className="text-xs tracking-widest text-muted uppercase">Boring on purpose</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Investing should take you five minutes to understand.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-secondary">
          Not five minutes a day. Five minutes, once — and then a plan boring enough that you can
          ignore it for thirty years. No stock picking, no forecasts, no paying someone a percentage
          of your savings every year to do neither well.
        </p>

        <blockquote className="mt-6 border-l-2 border-[var(--series-equity)] pl-4">
          <p className="text-secondary italic">
            &ldquo;Consistently buy an S&amp;P 500 low-cost index fund… Keep buying it through thick
            and thin, and especially through thin.&rdquo;
          </p>
          <footer className="mt-2 text-sm text-muted">
            Warren Buffett. He has also pointed out the obvious problem with this advice:{" "}
            <em>nobody gets paid to give it to you.</em>
          </footer>
        </blockquote>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onStart} className="btn-primary">
            Build my plan — 5 minutes
          </button>
          <a href="#why" className="btn-ghost">
            Why this works
          </a>
        </div>
      </div>

      <div className="flex-1">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-lg">
          <div className="relative aspect-video">
            {playing ? (
              <iframe
                className="absolute inset-0 size-full"
                src={`https://www.youtube-nocookie.com/embed/${BUFFETT_VIDEO_ID}?autoplay=1`}
                title={BUFFETT_TITLE}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 size-full"
                aria-label={`Play: ${BUFFETT_TITLE}`}
              >
                {/* next/image buys nothing here: the site is a static export with
                    images unoptimized, and this is a fixed remote thumbnail. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${BUFFETT_VIDEO_ID}/hqdefault.jpg`}
                  alt=""
                  className="size-full object-cover opacity-80 transition group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-black">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">{BUFFETT_TITLE}</p>
      </div>
    </section>
  );
}
