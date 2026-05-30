/**
 * Visual regression. See docs/e2e-test-plan.md §6.15 + §10.3.
 * Runs in the `visual` project. Baselines authoritative in CI (Linux/chromium).
 * Uses helpers/visual.ts → stableScreenshot() which masks dynamic regions.
 *
 * To generate/update baselines:
 *   npx playwright test --project=visual --update-snapshots
 */
import { test } from "@playwright/test";
import { stableScreenshot } from "./helpers/visual";
import { installMocks } from "./helpers/mocks";
import { DEMO_SHOP_ID } from "./fixtures/test-data";

test.describe("Visual regression @visual", () => {
  test("@visual login page", async ({ page }) => {
    await page.context().clearCookies();
    const ctx = page.context();
    await ctx.addInitScript(() => localStorage.clear());
    await page.goto("/login");
    await stableScreenshot(page, "login.png");
  });

  test("@visual signup page", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/signup");
    await stableScreenshot(page, "signup.png");
  });

  test("@visual dashboard analytics", async ({ page }) => {
    await page.goto("/dashboard/analytics");
    await stableScreenshot(page, "dashboard.png");
  });

  test("@visual shops list", async ({ page }) => {
    await page.goto("/dashboard/shop/all");
    await stableScreenshot(page, "shops-list.png");
  });

  test("@visual orders list", async ({ page }) => {
    await page.goto("/dashboard/order/all");
    await stableScreenshot(page, "orders-list.png");
  });

  test("@visual customers list", async ({ page }) => {
    await page.goto("/dashboard/customer/all");
    await stableScreenshot(page, "customers-list.png");
  });

  test("@visual products list", async ({ page }) => {
    await page.goto("/dashboard/product/all");
    await stableScreenshot(page, "products-list.png");
  });

  test("@visual shop add form (empty)", async ({ page }) => {
    await page.goto("/dashboard/shop/add");
    await stableScreenshot(page, "shop-add-form.png");
  });

  test("@visual customer add form (empty)", async ({ page }) => {
    await page.goto("/dashboard/customer/add");
    await stableScreenshot(page, "customer-add-form.png");
  });

  test("@visual GST verified panel (mocked, deterministic)", async ({ page }) => {
    await installMocks(page);
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}/edit`);
    // Drive through the OTP flow so the verified panel appears
    await page.getByLabel(/shop name/i).waitFor({ timeout: 10_000 });
    await page.getByLabel(/gstin/i).fill("27AABCU9603R1ZX");
    const sendOtp = page.getByRole("button", { name: /send otp/i });
    if (await sendOtp.count() > 0) {
      await sendOtp.click();
      await page.getByLabel(/otp/i).fill("123456");
      await page.getByRole("button", { name: /^verify$/i }).click();
      await page.getByText(/verified from gst portal/i).waitFor({ timeout: 8_000 }).catch(() => {});
    }
    await stableScreenshot(page, "gst-verified-panel.png");
  });
});
