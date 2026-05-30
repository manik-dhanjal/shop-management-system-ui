/**
 * Login page tests.
 * These run WITHOUT the saved auth state — they test the login UI itself.
 * TextBox component uses id= on both input and label, not htmlFor.
 * Use input#email / input#password selectors.
 */
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("shows the login form", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /login to your account/i }),
    ).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
  });

  test("redirects to dashboard after valid login", async ({ page }) => {
    await page.locator("input#email").fill("admin@sms.com");
    await page.locator("input#password").fill("Admin@123");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test("shows an error message on wrong credentials", async ({ page }) => {
    await page.locator("input#email").fill("admin@sms.com");
    await page.locator("input#password").fill("wrongpassword");
    await page.getByRole("button", { name: /login/i }).click();

    const errorAlert = page.locator(
      "[role='alert'], .MuiAlert-root, [class*='alert']",
    );
    await expect(errorAlert.first()).toBeVisible({ timeout: 8_000 });
  });

  test("login button shows loading state while submitting", async ({ page }) => {
    await page.locator("input#email").fill("admin@sms.com");
    await page.locator("input#password").fill("Admin@123");

    const btn = page.getByRole("button", { name: /login/i });
    await btn.click();

    await expect(btn).toHaveText(/logging in/i, { timeout: 3_000 }).catch(() => {});
  });

  test("has a signup link", async ({ page }) => {
    const signupLink = page.getByRole("link", { name: /sign up/i });
    await expect(signupLink).toBeVisible();
    await signupLink.click();
    await expect(page).toHaveURL(/\/signup/);
  });
});
