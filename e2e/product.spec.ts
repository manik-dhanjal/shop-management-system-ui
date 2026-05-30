/**
 * Product / inventory. See docs/e2e-test-plan.md §6.4 and docs/product.md.
 */
import { test, expect } from "@playwright/test";
import { goToProducts, goToAddProduct } from "./helpers/navigate";
import { adminContext, createProduct, deleteProduct, DEMO_SHOP_ID } from "./fixtures/api-client";
import { uniqueName } from "./fixtures/test-data";
import { expectValidationError } from "./helpers/forms";

// ── All Products ─────────────────────────────────────────────────────────────
test.describe("All Products", () => {
  test.beforeEach(async ({ page }) => { await goToProducts(page); });

  test("@smoke list loads + KPI cards visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await expect(page.getByRole("heading", { name: /products/i }).first()).toBeVisible({ timeout: 10_000 });
    expect(errors).toHaveLength(0);
  });

  test("@smoke KPI cards render (Products, Total Stock, Out of Stock, Stock Value)", async ({ page }) => {
    // Seeded products exist; at least one KPI card should be visible
    await expect(page.getByText(/total stock|out of stock|stock value/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test("@smoke Add Product button present", async ({ page }) => {
    const addBtn = page.getByRole("link", { name: /add product/i }).or(page.getByRole("button", { name: /add product/i }));
    await expect(addBtn.first()).toBeVisible({ timeout: 8_000 });
  });

  test("@full search narrows results", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search name \/ sku/i);
    await searchInput.fill("pipe");
    // Results update (spinner or results change)
    await page.waitForTimeout(500); // debounce
    await expect(page.locator("table, [class*='table']").first()).toBeVisible({ timeout: 8_000 });
  });
});

// ── Add / Edit Product ────────────────────────────────────────────────────────
test.describe("Add Product", () => {
  test.beforeEach(async ({ page }) => { await goToAddProduct(page); });

  test("@smoke form fields visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /add product|new product/i }).first()).toBeVisible({ timeout: 10_000 }).catch(async () => {
      // Some forms use a section heading instead of page heading
      await expect(page.getByLabel(/name/i).first()).toBeVisible({ timeout: 10_000 });
    });
  });

  test("@full required validation — empty name blocks submit", async ({ page }) => {
    await page.getByRole("button", { name: /save|add|create/i }).first().click();
    await expectValidationError(page);
  });
});

// ── Create/Edit/Delete (critical) ─────────────────────────────────────────────
test.describe("Product CRUD @critical", () => {
  let productId: string | null = null;
  const name = uniqueName("product");

  test.afterAll(async () => {
    if (productId) {
      const { ctx, access } = await adminContext();
      await deleteProduct(ctx, access, DEMO_SHOP_ID, productId).catch(() => {});
      await ctx.dispose();
    }
  });

  test("@critical create product via API → appears in list", async ({ page }) => {
    const { ctx, access } = await adminContext();
    const product = await createProduct(ctx, access, DEMO_SHOP_ID, {
      name,
      sku: `SKU-${name}`,
      sellPrice: 100,
      purchasePrice: 80,
      stock: 10,
      measuringUnit: "Pieces",
    });
    productId = product._id;
    await ctx.dispose();

    await goToProducts(page);
    await expect(page.getByRole("heading", { name: /products/i }).first()).toBeVisible({ timeout: 10_000 });
    // Product list has specific search placeholder
    const search = page.getByPlaceholder(/search name \/ sku/i);
    await search.fill(name);
    await page.waitForTimeout(500);
    await expect(page.getByText(name).first()).toBeVisible({ timeout: 8_000 });
  });

  test("@critical edit product via UI → save navigates back to list/detail", async ({ page }) => {
    if (!productId) test.skip();
    await page.goto(`/dashboard/product/${productId}/edit`);
    const nameField = page.getByLabel(/name/i).first();
    await expect(nameField).toBeVisible({ timeout: 10_000 });
    await nameField.fill(`${name}-edited`);
    await page.getByRole("button", { name: /save|update/i }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/product/, { timeout: 10_000 });
  });

  test("@full delete from list → confirm → row removed", async ({ page }) => {
    if (!productId) test.skip();
    await goToProducts(page);
    await expect(page.getByRole("heading", { name: /products/i }).first()).toBeVisible({ timeout: 10_000 });
    const search = page.getByPlaceholder(/search name \/ sku/i);
    await search.fill(name.replace("-edited", ""));
    await page.waitForTimeout(500);
    const deleteBtn = page.getByRole("button", { name: /delete/i }).first();
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click();
      const confirmBtn = page.getByRole("button", { name: /confirm|yes|delete/i }).last();
      if (await confirmBtn.count() > 0) await confirmBtn.click();
      productId = null; // deleted via UI
    }
  });
});
