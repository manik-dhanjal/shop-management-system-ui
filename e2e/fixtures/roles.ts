/**
 * Role-scoped page fixtures.
 *
 * Import from this module instead of "@playwright/test" when a spec needs a
 * specific role's session:
 *
 *   import { test, expect } from "../fixtures/roles";
 *   test("employee can create an order", async ({ employeePage }) => { ... });
 *
 * Each fixture is a Page backed by the storageState produced by auth.setup.ts.
 * The default `page` fixture remains the project's default (admin).
 */
import { test as base, expect, Page } from "@playwright/test";

type RoleFixtures = {
  adminPage: Page;
  managerPage: Page;
  employeePage: Page;
};

async function pageWithState(browser: any, statePath: string): Promise<Page> {
  const ctx = await browser.newContext({ storageState: statePath });
  return ctx.newPage();
}

export const test = base.extend<RoleFixtures>({
  adminPage: async ({ browser }, use) => {
    const page = await pageWithState(browser, "e2e/.auth/admin.json");
    await use(page);
    await page.context().close();
  },
  managerPage: async ({ browser }, use) => {
    const page = await pageWithState(browser, "e2e/.auth/manager.json");
    await use(page);
    await page.context().close();
  },
  employeePage: async ({ browser }, use) => {
    const page = await pageWithState(browser, "e2e/.auth/employee.json");
    await use(page);
    await page.context().close();
  },
});

export { expect };
