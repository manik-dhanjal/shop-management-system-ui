import { defineConfig, devices } from "@playwright/test";

/**
 * See docs/e2e-test-plan.md §5 for the rationale behind these projects + tags.
 * Env: BASE_URL, API_URL, MOCK_EXTERNALS, CI.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // shared dev/stage DB → avoid write races
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    actionTimeout: 15_000,
    navigationTimeout: 30_000, // Render cold-start tolerance
  },

  expect: { timeout: 10_000 },

  projects: [
    // Logs in once per role; writes e2e/.auth/{admin,manager,employee}.json
    { name: "setup", testMatch: "**/auth.setup.ts" },

    // Functional suite (default role = admin). Role specs override via fixtures.
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testIgnore: ["**/visual.spec.ts", "**/*.a11y.spec.ts"],
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testIgnore: ["**/visual.spec.ts", "**/*.a11y.spec.ts"],
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testIgnore: ["**/visual.spec.ts", "**/*.a11y.spec.ts"],
    },

    // Responsive subset (run with --grep @mobile)
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testIgnore: ["**/visual.spec.ts", "**/*.a11y.spec.ts"],
    },

    // Accessibility (run with --project=a11y)
    {
      name: "a11y",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testMatch: ["**/*.a11y.spec.ts"],
    },

    // Visual regression (run with --project=visual). Baselines authoritative in CI.
    {
      name: "visual",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/admin.json" },
      dependencies: ["setup"],
      testMatch: ["**/visual.spec.ts"],
    },
  ],
});
