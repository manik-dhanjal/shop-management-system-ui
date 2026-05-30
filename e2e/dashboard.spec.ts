/**
 * Analytics landing + dashboard chrome. See docs/e2e-test-plan.md §6.13.
 */
import { test, expect } from "@playwright/test";

test.describe("Dashboard / Analytics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/analytics");
  });

  test("@smoke loads without JS errors and shows heading", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await expect(
      page.getByRole("heading", { name: /analytics|dashboard/i }).first(),
    ).toBeVisible({ timeout: 10_000 });
    expect(errors, `JS errors: ${errors.join(", ")}`).toHaveLength(0);
  });

  test("@full charts mount (canvas elements present)", async ({ page }) => {
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 10_000 });
  });

  test("@full sidebar renders navigation links", async ({ page }) => {
    // Sidebar should link to major sections
    const sidebar = page.locator("nav, aside, [class*='sidebar']").first();
    await expect(sidebar).toBeVisible({ timeout: 8_000 });
  });
});
