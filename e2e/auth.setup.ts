/**
 * Runs once before all tests (the `setup` project).
 *
 * Produces three saved storageStates — admin / manager / employee — so RBAC
 * specs can run as any role. See docs/e2e-test-plan.md §4.
 *
 * IMPORTANT (see §2 of the plan): an invited-but-never-registered user has no
 * password and can NEVER log in. So non-admin roles are provisioned as:
 *   1. register (gives them a password)               — 409 if already exists, fine
 *   2. admin invites their existing email to the shop — links + adds role; 400 if
 *      already linked, fine
 *   3. re-login                                        — fresh token carrying the
 *      shop+role in shopsMeta
 * The whole flow is idempotent against the shared dev/stage DB.
 */
import { test as setup, expect, request as pwRequest, Page } from "@playwright/test";
import { ADMIN, MANAGER, EMPLOYEE, DEMO_SHOP_ID } from "./fixtures/test-data";
import { login, ensureRegistered, ensureMember, Tokens } from "./fixtures/api-client";

async function saveState(page: Page, tokens: Tokens, file: string) {
  await page.goto("/login");
  await page.evaluate(
    ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    { accessToken: tokens.access, refreshToken: tokens.refresh },
  );
  await page.goto("/dashboard/analytics");
  await expect(page).not.toHaveURL(/\/login/);
  await page.context().storageState({ path: file });
}

setup("authenticate admin", async ({ page }) => {
  const ctx = await pwRequest.newContext();
  const tokens = await login(ctx, ADMIN.email, ADMIN.password);
  await saveState(page, tokens, "e2e/.auth/admin.json");
  await ctx.dispose();
});

setup("provision + authenticate manager", async ({ page }) => {
  const ctx = await pwRequest.newContext();
  const admin = await login(ctx, ADMIN.email, ADMIN.password);
  await ensureRegistered(ctx, MANAGER);
  await ensureMember(ctx, admin.access, DEMO_SHOP_ID, MANAGER.email, ["manager"]);
  const tokens = await login(ctx, MANAGER.email, MANAGER.password); // re-login → role-bearing token
  await saveState(page, tokens, "e2e/.auth/manager.json");
  await ctx.dispose();
});

setup("provision + authenticate employee", async ({ page }) => {
  const ctx = await pwRequest.newContext();
  const admin = await login(ctx, ADMIN.email, ADMIN.password);
  await ensureRegistered(ctx, EMPLOYEE);
  await ensureMember(ctx, admin.access, DEMO_SHOP_ID, EMPLOYEE.email, ["employee"]);
  const tokens = await login(ctx, EMPLOYEE.email, EMPLOYEE.password);
  await saveState(page, tokens, "e2e/.auth/employee.json");
  await ctx.dispose();
});
