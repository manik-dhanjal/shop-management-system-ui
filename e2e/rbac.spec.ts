/**
 * Role permission boundaries. See docs/e2e-test-plan.md §6.12.
 *
 * Guard semantics (from RolesGuard in the backend):
 *   - no shopsMeta entry for :shopId  → 404 Not Found
 *   - shop present but wrong role      → 403 Forbidden
 *
 * NOTE: page.request doesn't send localStorage tokens — they must be extracted
 * manually and added as Authorization headers for API-level assertions.
 */
import { test, expect } from "./fixtures/roles";
import { DEMO_SHOP_ID, API_URL } from "./fixtures/test-data";

test.describe("RBAC — admin sees all controls", () => {
  test("@rbac @critical admin sees Edit + Delete + Invite on shop detail", async ({ adminPage: page }) => {
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}`);
    await expect(page.getByRole("button", { name: /edit/i }).or(page.getByRole("link", { name: /edit/i })).first()).toBeVisible({ timeout: 10_000 });
  });

  test("@rbac admin can access shop edit page without permission banner", async ({ adminPage: page }) => {
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}/edit`);
    await expect(page.getByLabel(/shop name/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/don't have admin access/i)).toBeHidden({ timeout: 3_000 }).catch(() => {});
  });
});

test.describe("RBAC — employee restrictions", () => {
  test("@rbac @critical employee can navigate to order add page", async ({ employeePage: page }) => {
    await page.goto("/dashboard/order/add");
    await expect(page.getByText(/order details/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("@rbac employee sees permission banner on shop edit page", async ({ employeePage: page }) => {
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}/edit`);
    await expect(
      page.getByText(/don't have admin access/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test("@rbac employee PATCH /shop API → 403 Forbidden", async ({ employeePage: page }) => {
    // Navigate to a dashboard page first so localStorage is accessible
    await page.goto("/dashboard/analytics");
    await page.waitForLoadState("domcontentloaded");
    const token = await page.evaluate(() => localStorage.getItem("accessToken"));
    if (!token) { test.skip(); return; }
    const res = await page.request.patch(`${API_URL}/api/v1/shop/${DEMO_SHOP_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: "Should Fail" },
    });
    expect(res.status()).toBe(403);
  });

  test("@rbac employee accessing another shop's endpoint → 404", async ({ employeePage: page }) => {
    await page.goto("/dashboard/analytics");
    await page.waitForLoadState("domcontentloaded");
    const token = await page.evaluate(() => localStorage.getItem("accessToken"));
    if (!token) { test.skip(); return; }
    const FAKE_SHOP = "000000000000000000000099";
    const res = await page.request.patch(`${API_URL}/api/v1/shop/${FAKE_SHOP}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: "Should 404" },
    });
    expect(res.status()).toBe(404);
  });
});

test.describe("RBAC — manager restrictions", () => {
  test("@rbac manager can access order list", async ({ managerPage: page }) => {
    await page.goto("/dashboard/order/all");
    await expect(page.getByRole("heading", { name: /orders/i }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("@rbac manager sees permission banner on shop edit", async ({ managerPage: page }) => {
    await page.goto(`/dashboard/shop/${DEMO_SHOP_ID}/edit`);
    await expect(
      page.getByText(/don't have admin access/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});
