const LESSONS = [
  {
    title: "Buying the whole market beats picking winners",
    body: "An index fund buys a tiny slice of every company at once. You are not betting on which firm wins — you are betting that the economy keeps producing value, which is a far easier bet. Over long periods most professional stock pickers fail to beat that simple approach after costs.",
  },
  {
    title: "Fees are the one thing you control",
    body: "Nobody can promise you a return. Anyone can promise you a cost. A 1% annual fee sounds trivial and quietly removes a large share of your lifetime gains, because it compounds against you for exactly as long as your money compounds for you.",
  },
  {
    title: "Time in the market, not timing the market",
    body: "Waiting for the right moment usually means missing the recovery. The days that matter most arrive without warning, often immediately after the frightening ones. Staying invested through the bad years is the whole strategy.",
  },
  {
    title: "Bonds are ballast, not profit",
    body: "Bonds are there to stop a crash forcing you to sell at the bottom in the years you actually need the money. That is why their share rises as retirement approaches — and why holding many of them in your thirties quietly costs you.",
  },
  {
    title: "Stock picking is a full-time job you already have",
    body: "Professionals doing this full time, with teams and data you cannot buy, mostly fail to beat the index. That is not an argument that you are incapable. It is an argument that the game is not worth your evenings.",
  },
  {
    title: "Automate it, then stop watching",
    body: "Set a monthly transfer and let it run. Investors who check constantly tend to sell during falls and buy after rises — the exact inverse of the plan. Boring is not a compromise here; it is the mechanism.",
  },
];

export function Learn() {
  return (
    <section id="why" className="scroll-mt-20">
      <h2 className="text-2xl font-bold sm:text-3xl">Why this works</h2>
      <p className="mt-2 max-w-2xl text-secondary">
        Six ideas. Together they are most of what a private investor needs, and they have not
        changed in fifty years.
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {LESSONS.map((l, i) => (
          <li key={l.title} className="card">
            <span className="text-xs font-semibold tabular-nums text-[var(--series-equity)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 font-semibold">{l.title}</h3>
            <p className="mt-2 text-sm text-secondary">{l.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
