import { expect, test, type Page } from "@playwright/test";

async function fillWizard(
  page: Page,
  {
    country = "CA",
    age = "42",
    retire = "65",
    savings = "60000",
    monthly = "500",
    income = "3500",
    pension = "0",
  }: Partial<Record<string, string>> = {},
) {
  await page.getByRole("button", { name: /build my plan/i }).click();
  await page.getByLabel("Country").selectOption(country);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Current age").fill(age);
  await page.getByLabel("Retirement age").fill(retire);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Current savings").fill(savings);
  await page.getByLabel("Monthly contribution").fill(monthly);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Desired monthly income").fill(income);
  await page.getByLabel("State pension").fill(pension);
  await page.getByRole("button", { name: "Continue" }).click();
}

async function answerRisk(page: Page, which: "low" | "mid" | "high") {
  const sets = {
    low: [/sell — i could not watch/i, /watching my pot fall/i, /makes me nervous/i],
    mid: [/sit tight/i, /equally/i, /would cope/i],
    high: [/buy more while it is cheap/i, /running out of money/i, /yes, and i stayed/i],
  } as const;
  for (const label of sets[which]) await page.getByRole("button", { name: label }).click();
  await expect(page.getByText("Your plan")).toBeVisible();
}

test.describe("Boring on Purpose", () => {
  test("leads with the Buffett clip and does not load YouTube until asked", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('img[src*="ytimg.com"]')).toBeVisible();
    // No iframe before the click: a cold embed costs ~1MB and sets cookies.
    await expect(page.locator("iframe")).toHaveCount(0);

    await page.getByRole("button", { name: /play:/i }).click();
    await expect(page.locator('iframe[src*="youtube-nocookie.com"]')).toHaveCount(1);
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

  test("a longer horizon puts more into equities", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { age: "25", retire: "65" });
    await answerRisk(page, "mid");
    const far = await page.getByText(/% broad-market index funds/).innerText();

    await page.getByRole("button", { name: "Start over" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Current age").fill("60");
    await page.getByLabel("Retirement age").fill("65");
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Continue" }).click();
    await answerRisk(page, "mid");
    const near = await page.getByText(/% broad-market index funds/).innerText();

    const pct = (s: string) => Number(s.match(/(\d+)%/)![1]);
    expect(pct(far)).toBeGreaterThan(pct(near));
  });

  test("risk tolerance moves the allocation", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page);
    await answerRisk(page, "low");
    const cautious = await page.getByText(/% broad-market index funds/).innerText();

    await page.getByRole("button", { name: "Start over" }).click();
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Continue" }).click();
    await answerRisk(page, "high");
    const bold = await page.getByText(/% broad-market index funds/).innerText();

    const pct = (s: string) => Number(s.match(/(\d+)%/)![1]);
    expect(pct(bold)).toBeGreaterThan(pct(cautious));
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

  test("gives country-specific accounts", async ({ page }) => {
    await page.goto("/");
    await fillWizard(page, { country: "CA" });
    await answerRisk(page, "mid");
    await expect(page.getByText("TFSA")).toBeVisible();

    await page.getByRole("button", { name: "Start over" }).click();
    await page.getByLabel("Country").selectOption("GB");
    for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Continue" }).click();
    await answerRisk(page, "mid");
    await expect(page.getByText("Stocks & Shares ISA")).toBeVisible();
  });

  test("will not let retirement age precede current age", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /build my plan/i }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Current age").fill("60");
    await page.getByLabel("Retirement age").fill("50");
    await expect(page.getByText(/needs to be later/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  test("carries the disclaimer", async ({ page }) => {
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
