import { expect, test, type Page } from "@playwright/test";

/**
 * Amounts are set with sliders and quick-pick chips rather than typed, so the
 * helpers drive those. The exact-entry box is the one path that still accepts a
 * precise figure, and is what `setAmount` uses.
 */
async function setAmount(page: Page, labelText: string, value: string) {
  const field = page.locator("div").filter({ hasText: labelText }).last();
  await field.getByRole("button", { name: /type an exact amount/i }).click();
  const input = page.getByLabel("or type an exact amount").last();
  await input.fill(value);
}

async function setAge(page: Page, label: string, value: number) {
  await page.getByLabel(label).fill(String(value));
}

async function fillWizard(
  page: Page,
  {
    country = "CA",
    age = 42,
    retire = 65,
    savings = "60000",
    monthly = "500",
    income = "3500",
    pension = "0",
  }: {
    country?: string;
    age?: number;
    retire?: number;
    savings?: string;
    monthly?: string;
    income?: string;
    pension?: string;
  } = {},
) {
  await page.getByRole("button", { name: /build my plan/i }).click();
  await page.getByLabel("Country").selectOption(country);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await setAge(page, "Current age", age);
  await setAge(page, "Retirement age", retire);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await setAmount(page, "saved or invested so far", savings);
  await setAmount(page, "put away each month", monthly);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await setAmount(page, "live on each month", income);
  await setAmount(page, "Expected", pension);
  await page.getByRole("button", { name: "Next", exact: true }).click();
}

async function answerRisk(page: Page, which: "low" | "mid" | "high") {
  const sets = {
    low: [/couldn't watch that happen/i, /watching my savings fall/i, /makes me nervous/i],
    mid: [/leave it alone and wait/i, /both about the same/i, /i'd hold on/i],
    high: [/buy more while it's cheap/i, /running out of money/i, /i didn't sell/i],
  } as const;
  for (const label of sets[which]) await page.getByRole("button", { name: label }).click();
  await expect(page.getByText("Your plan").first()).toBeVisible();
}

function equityPct(text: string) {
  return Number(text.match(/(\d+)%/)![1]);
}

test.describe("Boring on Purpose", () => {
  test("does not embed a video or hide the first question behind one", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.locator('img[src*="ytimg.com"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: /build my plan/i })).toBeVisible();
  });

  test("applies the 4% rule to the retirement target", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { income: "3500" });
    await answerRisk(page, "mid");
    // 3500 * 12 / 0.04 = 1,050,000
    await expect(page.getByText("$1,050,000").first()).toBeVisible();
  });

  test("a state pension shrinks the target", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { income: "3500", pension: "1500" });
    await answerRisk(page, "mid");
    // (3500 - 1500) * 12 / 0.04 = 600,000
    await expect(page.getByText("$600,000").first()).toBeVisible();
  });

  test("a quick-pick chip sets the amount without any typing", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /build my plan/i }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    await page.getByRole("button", { name: "$50,000", exact: true }).click();
    await expect(page.getByText("$50,000").first()).toBeVisible();
  });

  test("a slider reads out its value as money while it moves", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /build my plan/i }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await setAge(page, "Current age", 55);
    await expect(page.getByText("55 years old")).toBeVisible();
  });

  test("a running recap keeps the earlier answers on screen", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { age: 42, retire: 65 });
    await expect(page.getByText("42 years old → at 65")).toBeVisible();
  });

  test("a longer horizon puts more into shares", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { age: 25, retire: 65 });
    await answerRisk(page, "mid");
    const far = equityPct(await page.getByText(/% in one fund/).innerText());

    await page.getByRole("button", { name: "Start again" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await setAge(page, "Current age", 60);
    await setAge(page, "Retirement age", 65);
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Next", exact: true }).click();
    await answerRisk(page, "mid");
    const near = equityPct(await page.getByText(/% in one fund/).innerText());

    expect(far).toBeGreaterThan(near);
  });

  test("risk tolerance moves the allocation", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "low");
    const cautious = equityPct(await page.getByText(/% in one fund/).innerText());

    await page.getByRole("button", { name: "Start again" }).click();
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Next", exact: true }).click();
    await answerRisk(page, "high");
    const bold = equityPct(await page.getByText(/% in one fund/).innerText());

    expect(bold).toBeGreaterThan(cautious);
  });

  test("shows the fee comparison with all three scenarios costing the same gross", async ({
    page,
  }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "mid");

    await expect(page.getByText("(0.05% a year)")).toBeVisible();
    await expect(page.getByText("(1.00% a year)")).toBeVisible();
    await expect(page.getByText("(1.90% a year)")).toBeVisible();
    await expect(page.getByText(/goes to fees/).first()).toBeVisible();
  });

  test("names country-appropriate funds, and never US-domiciled ones abroad", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { country: "CA" });
    await answerRisk(page, "mid");
    await expect(page.getByText("VEQT")).toBeVisible();
    await expect(page.getByText("TFSA")).toBeVisible();
    await expect(page.getByText(/rather than recommendations/i)).toBeVisible();

    await page.getByRole("button", { name: "Start again" }).click();
    await page.getByLabel("Country").selectOption("FR");
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Next", exact: true }).click();
    await answerRisk(page, "mid");
    // A French PEA cannot hold the Canadian or US products at all.
    await expect(page.getByText("CW8")).toBeVisible();
    await expect(page.getByText("VEQT")).toHaveCount(0);
    await expect(page.getByText("VTI")).toHaveCount(0);
  });

  test("names bond funds too, not just the share side", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { country: "CA" });
    await answerRisk(page, "mid");

    await expect(page.getByText(/the steady part/i).first()).toBeVisible();
    await expect(page.getByText("VAB").first()).toBeVisible();
    await expect(page.getByText("ZAG").first()).toBeVisible();
    // The two things people get wrong: doubling up, and going unhedged.
    await expect(page.getByText(/already inside it/i)).toBeVisible();
    await expect(page.getByText(/bet on exchange rates/i)).toBeVisible();
  });

  test("tells French users bonds do not belong in a PEA", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { country: "FR" });
    await answerRisk(page, "mid");
    await expect(page.getByText(/Fonds euros/i).first()).toBeVisible();
    await expect(page.getByText(/do not belong in a PEA/i)).toBeVisible();
  });

  test("teaches the criteria, not just the tickers", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "mid");
    await expect(page.getByText(/How to spot a good one yourself/i)).toBeVisible();
    await expect(page.getByText(/less than about 0.30% a year/i)).toBeVisible();
    await expect(page.getByText(/The trap to avoid in Canada/i)).toBeVisible();
  });

  test("will not let retirement age precede current age", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /build my plan/i }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await setAge(page, "Current age", 60);
    await setAge(page, "Retirement age", 50);
    await expect(page.getByText(/needs to be older than you are now/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  });

  test("a cleared exact-amount field accepts typing normally", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /build my plan/i }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    const field = page.locator("div").filter({ hasText: "saved or invested so far" }).last();
    await field.getByRole("button", { name: /type an exact amount/i }).click();
    const input = page.getByLabel("or type an exact amount").last();

    await input.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");
    await expect(input).toHaveValue("");

    // Digits must not queue up behind a stuck zero.
    await page.keyboard.type("0");
    await page.keyboard.type("1234");
    await expect(input).toHaveValue("1234");
  });

  test("switches the whole page to French and remembers the choice", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "FR" }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Investir");

    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Investir");
  });

  test("gives French users French accounts, funds and the right currency", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "FR" }).click();
    await page.getByRole("button", { name: /Créer mon plan/i }).click();
    await page.getByLabel("Country").selectOption("FR");
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Suivant", exact: true }).click();
    for (const l of [/n'y toucherais pas/i, /autant l'un que l'autre/i, /je tiendrais bon/i]) {
      await page.getByRole("button", { name: l }).click();
    }

    await expect(page.getByText("Votre plan").first()).toBeVisible();
    await expect(page.getByText("PEA").first()).toBeVisible();
    await expect(page.getByText("CW8")).toBeVisible();
    await expect(page.getByText(/synthétiques/)).toBeVisible();
    // Numbers follow the country, not the interface language.
    await expect(page.getByText(/€/).first()).toBeVisible();
  });

  test("says it is a learning tool before a single question is answered", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/a learning tool, not financial advice/i)).toBeVisible();
  });

  test("repeats the warning above the results, where the numbers appear", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "mid");

    const warning = page.getByText(/this is a learning tool and not financial advice/i);
    await expect(warning).toBeVisible();
    await expect(page.getByText(/not to tell you what to do with your money/i)).toBeVisible();
    await expect(page.getByText(/flat fee instead of taking a slice/i)).toBeVisible();

    // It has to come before the target figure, not after it.
    const warningY = (await warning.boundingBox())!.y;
    const targetY = (await page.getByText("$1,050,000").first().boundingBox())!.y;
    expect(warningY).toBeLessThan(targetY);
  });

  test("does not phrase the account order as an instruction", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "mid");
    // "Do this, in this order" reads as advice; this is a learning tool.
    await expect(page.getByText("Do this, in this order")).toHaveCount(0);
    await expect(page.getByText(/order people usually fill these/i)).toBeVisible();
  });

  test("warns in French too", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "FR" }).click();
    await expect(page.getByText(/outil pédagogique, pas un conseil financier/i)).toBeVisible();
  });

  test("keeps the full notice in the footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/education, not financial advice/i)).toBeVisible();
  });

  test("works on a phone without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "mid");
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
