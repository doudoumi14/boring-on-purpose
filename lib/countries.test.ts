import { describe, expect, it } from "vitest";
import { countries, getCountry } from "./countries";
import { countriesFr } from "./countries.fr";
import { dict } from "./i18n";

describe("country translations", () => {
  it("has a French entry for every country", () => {
    for (const c of countries) {
      expect(countriesFr[c.code], `missing French copy for ${c.code}`).toBeDefined();
    }
  });

  it("keeps the same number of accounts and examples in both languages", () => {
    for (const c of countries) {
      const fr = countriesFr[c.code];
      expect(fr.accounts, c.code).toHaveLength(c.accounts.length);
      expect(fr.examples, c.code).toHaveLength(c.examples.length);
      expect(fr.bondExamples, c.code).toHaveLength(c.bondExamples.length);
    }
  });

  it("keeps the same tickers in both languages — those are not translatable", () => {
    for (const c of countries) {
      const fr = countriesFr[c.code];
      expect(fr.examples.map((e) => e.ticker), c.code).toEqual(c.examples.map((e) => e.ticker));
      expect(fr.bondExamples.map((e) => e.ticker), c.code).toEqual(
        c.bondExamples.map((e) => e.ticker),
      );
    }
  });

  it("leaves no English prose in the French copy", () => {
    for (const c of countries) {
      const fr = countriesFr[c.code];
      expect(fr.pitfall, c.code).not.toBe(c.pitfall);
      expect(fr.fundGuidance, c.code).not.toBe(c.fundGuidance);
      expect(fr.bondNote, c.code).not.toBe(c.bondNote);
    }
  });

  it("returns French copy when asked, English otherwise", () => {
    expect(getCountry("CA", "fr").accounts[1].name).toBe("CELI");
    expect(getCountry("CA", "en").accounts[1].name).toBe("TFSA");
  });

  it("carries the French preposition, since a template cannot guess it", () => {
    expect(getCountry("FR", "fr").inCountry).toBe("en France");
    expect(getCountry("CA", "fr").inCountry).toBe("au Canada");
  });

  it("gives every country bond examples, not just equity ones", () => {
    for (const c of countries) {
      expect(c.bondExamples.length, c.code).toBeGreaterThanOrEqual(2);
      expect(c.bondNote.length, c.code).toBeGreaterThan(40);
    }
  });

  it("warns about currency hedging, which matters far more for bonds", () => {
    for (const c of countries) {
      const text = `${c.bondNote} ${c.bondExamples.map((b) => b.note).join(" ")}`.toLowerCase();
      expect(text, c.code).toMatch(/hedg|currency|exchange rate|fonds euros|deposit/);
    }
  });

  it("does not put bonds in a PEA, which is an equity-only wrapper", () => {
    expect(getCountry("FR", "en").bondNote).toMatch(/not belong in a PEA/i);
  });

  it("falls back to English for an unknown code rather than throwing", () => {
    expect(getCountry("ZZ", "fr").code).toBe("OTHER");
  });
});

describe("country phrasing in sentences", () => {
  it("carries its own preposition so templates never double it", () => {
    // "buy ${inCountry}" must read correctly in both languages.
    expect(getCountry("CA", "en").inCountry).toBe("in Canada");
    expect(getCountry("CA", "fr").inCountry).toBe("au Canada");
    expect(dict.en.buy.lede(getCountry("CA", "en").inCountry)).toContain("buy in Canada");
    expect(dict.en.buy.lede(getCountry("CA", "en").inCountry)).not.toContain("in in");
    expect(dict.fr.buy.lede(getCountry("FR", "fr").inCountry)).toContain("disponibles en France");
    expect(dict.en.buy.trap(getCountry("US", "en").inCountry)).toBe(
      "The trap to avoid in United States",
    );
  });
});
