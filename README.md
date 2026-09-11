# Boring on Purpose

**Live: https://invest.adembrouri.com**

A free tool that turns five questions into a plain, index-fund retirement plan — in about five minutes, with no signup and nothing stored.

It exists because of a specific frustration: people approaching retirement pay someone a percentage of their savings every year to pick stocks, when the evidence says a broad-market index fund would serve them better. As Warren Buffett has pointed out, the reason nobody tells them this is that **nobody gets paid to.**

## What it does

You answer five things — country, timeline, savings, target retirement income, and how you react to a crash — and it returns:

- **Your number.** How large a pot you need, using the 4% rule, in today's money.
- **An allocation.** A stocks/bonds split driven mainly by your time horizon, then nudged by risk tolerance. "Stocks" always means a broad-market index fund, never individual picks.
- **A projection.** Year-by-year balance against that target.
- **The cost of fees.** The same plan at 0.05%, 1% and 1.9% a year. This is usually the most persuasive screen in the tool — all three bars are the same length, because the returns are identical. Only the split between you and the fee changes.
- **An order of operations.** Which tax-sheltered account to fill first, specific to your country (TFSA/RRSP, 401(k)/IRA, ISA/SIPP, PEA, Depot, Super).

## Design decisions worth knowing

**Everything is in real terms.** Telling a 35-year-old they need $2.4M is true and useless — nobody has intuition for what $2.4M buys in 2056. Every figure is inflation-adjusted into today's money, which means every return assumption is a real return and inflation is never added back.

**No tickers, ever.** The tool names *categories* of fund, not products. Recommending a specific product is the behaviour this site argues against, and it would age badly.

**Nationality is asked for exactly two reasons**: which tax wrapper to fill first (the highest-value decision most people can make), and which flavour of fund is sensibly buyable where they live.

**The YouTube embed is not loaded until clicked.** A cold iframe costs roughly a megabyte and sets cookies before anyone has asked to watch — a poor trade on a page promising five minutes.

**Nothing leaves the browser.** No backend, no database, no analytics, no account. The static export makes that structurally true rather than a promise.

## Assumptions

| Assumption | Value | Source of the number |
|---|---|---|
| Equity real return | 5.0%/yr | Long-run historical, after inflation |
| Bond real return | 1.5%/yr | Long-run historical, after inflation |
| Safe withdrawal rate | 4% | Trinity study, 30-year retirement |
| Index fund cost | 0.05%/yr | Typical broad-market ETF |
| Advised cost | 1.00%/yr | Typical percentage-of-assets advisor |
| Active fund cost | 1.90%/yr | Typical actively managed fund |

These are planning assumptions, not forecasts. Real markets do not deliver an even 5% a year.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 30 unit tests over the finance maths
npm run test:e2e   # 10 browser tests over the whole flow
npm run build      # static export to out/
```

## How it is built

- **Next.js + TypeScript + Tailwind**, static export, no server.
- **`lib/finance.ts`** holds every calculation as pure functions, covered by 30 tests. The tests assert against independently derived values (the 4% rule gives 25× spending; `requiredMonthlyContribution` is verified as the exact inverse of `projectBalance`) rather than snapshots of the code's own output.
- **Charts are hand-built SVG/CSS** — no charting library. Colours come from a palette validated for colour-vision deficiency (worst adjacent pair ΔE 24.7 light / 26.8 dark against a ≥8 target), and no chart relies on colour alone: every series carries a direct label.

## This is not financial advice

This is an educational tool. It is not a licensed financial advisor, and it knows nothing about you beyond five answers. Tax rules vary by country and change. Check anything here against your own circumstances — and if you want help, prefer a fee-only advisor who charges a flat fee over one who takes a percentage of your savings every year.

## Licence

MIT.
