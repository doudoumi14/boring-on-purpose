import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Vitest's default glob also matches *.spec.ts, which sweeps up the
    // Playwright suite in e2e/ and fails on collection — those specs need
    // Playwright's own runner, not this one. Scope vitest to the unit tests.
    include: ["lib/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**", ".next/**", "out/**"],
  },
});
