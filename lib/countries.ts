/**
 * Nationality matters for exactly two practical reasons:
 *   1. Which tax-sheltered wrapper you should fill first — the single highest-
 *      value decision most people can make, and it is country-specific.
 *   2. Which flavour of broad-market fund is actually buyable and sensibly
 *      taxed where you live (a European buying US-domiciled ETFs runs into
 *      PRIIPs and estate-tax problems; a Canadian has currency and withholding
 *      considerations).
 *
 * Named examples are included deliberately. "Buy a broad index fund" is useless
 * to someone with no financial background — they walk into their bank and get
 * sold a 2% product, which is the exact outcome this site exists to prevent.
 *
 * Naming a broad index fund is not stock picking; within a category these funds
 * are near-interchangeable, which is the whole point. They ship alongside the
 * criteria that identify an equivalent, so the transferable skill is "recognise
 * a good fund", not "buy this ticker". Fees and names change — the criteria do
 * not.
 */

import { countriesFr } from "./countries.fr";
import type { Lang } from "./i18n";

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  /** Tax-sheltered accounts, in the order most people should fill them. */
  accounts: { name: string; note: string }[];
  /** The kind of fund to look for. */
  fundGuidance: string;
  /**
   * Concrete examples, because "buy a broad index fund" leaves someone with no
   * financial background exactly where they started — at their bank, being
   * sold a 2% product. These are illustrations of the category, not picks:
   * within a category these funds are near-interchangeable, which is the
   * point. The criteria beside them are what actually transfer.
   */
  examples: { name: string; ticker?: string; note: string }[];
  /** The specific way people in this country get separated from their money. */
  pitfall: string;
  /** Where to look up the actual state pension entitlement. */
  statePension: { name: string; lookup: string };
}

export const countries: Country[] = [
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "$",
    locale: "en-CA",
    accounts: [
      { name: "Employer RRSP match", note: "If your employer matches, take the match first. It is an instant return nothing else beats." },
      { name: "TFSA", note: "Growth and withdrawals are tax-free. Flexible, so it suits most people before an RRSP." },
      { name: "RRSP", note: "Deduction now, taxed on withdrawal. Strongest when your income is high today and lower in retirement." },
      { name: "Non-registered", note: "Only once the sheltered room above is used up." },
    ],
    fundGuidance:
      "A single Canadian-listed all-in-one global equity ETF, or a total-market index fund. One fund is genuinely enough.",
    examples: [
      { name: "Vanguard All-Equity ETF Portfolio", ticker: "VEQT", note: "One fund, all stocks, whole world. Rebalances itself." },
      { name: "iShares Core Equity ETF Portfolio", ticker: "XEQT", note: "The same idea from a different provider. Either is fine." },
      { name: "Vanguard Growth ETF Portfolio", ticker: "VGRO", note: "Roughly 80% stocks / 20% bonds, if you want the bonds built in." },
    ],
    pitfall:
      "Bank-branded mutual funds routinely charge 2% a year or more, and are what you will be offered if you walk into a branch and ask. A high-interest savings account is not investing either — over thirty years it loses to inflation.",
    statePension: { name: "CPP + OAS", lookup: "canada.ca — My Service Canada Account gives your actual CPP estimate" },
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    accounts: [
      { name: "401(k) up to the match", note: "Never leave an employer match on the table." },
      { name: "Roth or Traditional IRA", note: "Roth if you expect higher taxes later; Traditional if lower." },
      { name: "Rest of the 401(k)", note: "Fill to the annual limit if you can." },
      { name: "Taxable brokerage", note: "After the sheltered accounts are full." },
    ],
    fundGuidance:
      "A total US stock market or S&P 500 index fund, plus a total international fund — or a single target-date fund that does it for you.",
    examples: [
      { name: "Vanguard Total World Stock ETF", ticker: "VT", note: "Every investable market on earth in one fund." },
      { name: "Vanguard Total Stock Market ETF", ticker: "VTI", note: "The entire US market. Pair with VXUS for outside the US." },
      { name: "Fidelity 500 Index Fund", ticker: "FXAIX", note: "A mutual fund rather than an ETF, at a near-zero expense ratio." },
      { name: "Vanguard Target Retirement funds", note: "Pick the year you retire and it shifts to bonds for you. The least effort of all." },
    ],
    pitfall:
      "A 401(k) menu often buries one cheap index fund among expensive actively managed ones — look for the lowest expense ratio with 'index' or 'S&P 500' in the name. And be wary of whole-life insurance sold as an investment; it usually is not one.",
    statePension: { name: "Social Security", lookup: "ssa.gov — your statement shows your projected benefit" },
  },
  {
    code: "GB",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    locale: "en-GB",
    accounts: [
      { name: "Workplace pension", note: "Contribute at least enough for the full employer match." },
      { name: "Stocks & Shares ISA", note: "Tax-free growth, and you can withdraw any time." },
      { name: "SIPP", note: "Tax relief on the way in, locked until pension age." },
      { name: "General investment account", note: "Only after the ISA allowance is used." },
    ],
    fundGuidance:
      "A UCITS global equity index fund — a single all-world tracker covers it. Accumulating units keep it simple.",
    examples: [
      { name: "Vanguard FTSE All-World UCITS ETF (Acc)", ticker: "VWRP", note: "The whole world in one fund. Accumulating, so dividends reinvest themselves." },
      { name: "iShares Core MSCI World UCITS ETF", ticker: "SWDA", note: "Developed markets. Very widely held." },
      { name: "Vanguard LifeStrategy 80% Equity", note: "Stocks and bonds in one fund, rebalanced for you." },
    ],
    pitfall:
      "The platform charges a fee on top of the fund's fee — check both. Avoid 'with-profits' and any adviser offering to manage your ISA for a percentage; the tax shelter is free and the fund choice takes ten minutes.",
    statePension: { name: "State Pension", lookup: "gov.uk/check-state-pension" },
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
    accounts: [
      { name: "PEA", note: "Tax-advantaged after five years. The default equity wrapper." },
      { name: "Assurance-vie", note: "Flexible, with its own tax advantages after eight years." },
      { name: "PER", note: "Retirement-specific, deductible now, locked until retirement." },
      { name: "Compte-titres", note: "For anything that will not fit in the above." },
    ],
    fundGuidance:
      "A UCITS world equity ETF. Inside a PEA, look for the PEA-eligible synthetic world trackers.",
    examples: [
      { name: "Amundi MSCI World (PEA)", ticker: "CW8", note: "The long-standing PEA-eligible world tracker." },
      { name: "iShares Core MSCI World Swap PEA", ticker: "WPEA", note: "Same exposure, around 0.25% a year." },
      { name: "BNP Paribas Easy S&P 500 (PEA)", note: "US large caps, around 0.15% a year." },
    ],
    pitfall:
      "World trackers inside a PEA are synthetic by necessity — the fund holds a basket of European shares and swaps its performance for the world index, because a PEA cannot hold non-European stocks directly. That is normal, not a red flag. The real trap is assurance-vie contracts stacked with frais de gestion plus unités de compte at 2% a year.",
    statePension: { name: "Retraite de base + complémentaire", lookup: "info-retraite.fr — your consolidated estimate" },
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    locale: "de-DE",
    accounts: [
      { name: "Betriebliche Altersvorsorge", note: "Employer scheme — take any match available." },
      { name: "Broker Depot with Sparerpauschbetrag", note: "Use the annual tax-free allowance on investment income." },
      { name: "Riester / Rürup", note: "Worth checking whether your situation qualifies; not for everyone." },
    ],
    fundGuidance:
      "A UCITS all-world ETF on a monthly Sparplan. Accumulating share classes keep the admin minimal.",
    examples: [
      { name: "Vanguard FTSE All-World UCITS ETF (Acc)", ticker: "VWCE", note: "Whole world, accumulating. The default answer for most German savers." },
      { name: "iShares Core MSCI World UCITS ETF", ticker: "IWDA", note: "Developed markets, very large and long-established." },
      { name: "SPDR MSCI ACWI IMI UCITS ETF", note: "World including small caps and emerging markets." },
    ],
    pitfall:
      "A bank Sparplan on an actively managed fund can carry an Ausgabeaufschlag of up to 5% before you have earned anything, plus a yearly fee. A broker Sparplan into a broad ETF often costs nothing per trade.",
    statePension: { name: "Gesetzliche Rente", lookup: "deutsche-rentenversicherung.de — your Renteninformation" },
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "$",
    locale: "en-AU",
    accounts: [
      { name: "Superannuation", note: "Check your fund's fees and that you are in a growth option if you have decades left." },
      { name: "Salary sacrifice into super", note: "Concessional contributions are taxed at 15%, often well below your marginal rate." },
      { name: "Brokerage account", note: "For money you may need before preservation age." },
    ],
    fundGuidance:
      "A broad Australian-listed global index ETF, or your super fund's low-cost indexed international option.",
    examples: [
      { name: "BetaShares Diversified All Growth ETF", ticker: "DHHF", note: "All stocks, whole world, one fund." },
      { name: "Vanguard Diversified High Growth Index ETF", ticker: "VDHG", note: "Roughly 90% stocks with a small bond allocation." },
      { name: "Vanguard MSCI International Shares ETF", ticker: "VGS", note: "Everything outside Australia. Often paired with VAS for local shares." },
    ],
    pitfall:
      "Retail super funds can quietly charge several times what an indexed option costs inside the same fund. Log in, find the indexed international option, and compare the fee — it is usually the single highest-value thing you can do in an afternoon.",
    statePension: { name: "Age Pension", lookup: "servicesaustralia.gov.au" },
  },
  {
    code: "OTHER",
    name: "Somewhere else",
    currency: "USD",
    currencySymbol: "$",
    locale: "en-US",
    accounts: [
      { name: "Any employer retirement scheme", note: "Especially if contributions are matched." },
      { name: "Your country's tax-sheltered account", note: "Almost every country has one. Finding it is the highest-value hour you will spend." },
      { name: "Ordinary brokerage account", note: "Once the sheltered options are used." },
    ],
    fundGuidance:
      "A broad global equity index fund with a low ongoing charge, bought in your own currency where possible.",
    examples: [
      { name: "A broad global index fund or ETF", note: "Look for 'All-World', 'MSCI World', 'ACWI' or 'total market' in the name." },
      { name: "A target-date or lifecycle fund", note: "If your provider offers one for your retirement year, it handles the stock/bond shift for you." },
    ],
    pitfall:
      "If you are not a US person, be careful buying US-domiciled ETFs: they can expose your estate to US tax above a low threshold, and many European brokers cannot sell them to you at all. Look for a fund domiciled in Ireland or Luxembourg (usually marked UCITS).",
    statePension: { name: "State pension", lookup: "Your national pension authority" },
  },
];

export function getCountry(code: string, lang: Lang = "en"): Country & { inCountry: string } {
  const base = countries.find((c) => c.code === code) ?? countries[countries.length - 1];
  if (lang === "en") return { ...base, inCountry: `in ${base.name}` };

  // Falls back to English per-country rather than failing: a missing
  // translation should degrade to readable text, not a blank panel. The
  // completeness test keeps that path from being needed.
  const fr = countriesFr[base.code];
  if (!fr) return { ...base, inCountry: `in ${base.name}` };
  return { ...base, ...fr };
}
