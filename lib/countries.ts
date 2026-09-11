/**
 * Nationality matters for exactly two practical reasons:
 *   1. Which tax-sheltered wrapper you should fill first — the single highest-
 *      value decision most people can make, and it is country-specific.
 *   2. Which flavour of broad-market fund is actually buyable and sensibly
 *      taxed where you live (a European buying US-domiciled ETFs runs into
 *      PRIIPs and estate-tax problems; a Canadian has currency and withholding
 *      considerations).
 *
 * Deliberately NO fund tickers anywhere. Naming a specific product is exactly
 * the kind of recommendation this tool argues against, and it would age badly.
 * Fund *categories* are safe and durable.
 */

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  /** Tax-sheltered accounts, in the order most people should fill them. */
  accounts: { name: string; note: string }[];
  /** The kind of fund to look for, not a product. */
  fundGuidance: string;
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
    statePension: { name: "State pension", lookup: "Your national pension authority" },
  },
];

export function getCountry(code: string): Country {
  return countries.find((c) => c.code === code) ?? countries[countries.length - 1];
}
