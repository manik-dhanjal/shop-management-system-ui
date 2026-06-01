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
});
