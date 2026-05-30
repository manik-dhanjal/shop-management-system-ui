import { Page } from "@playwright/test";

export async function goToDashboard(page: Page) {
  await page.goto("/dashboard/analytics");
}

export async function goToShops(page: Page) {
  await page.goto("/dashboard/shop/all");
}

export async function goToAddShop(page: Page) {
  await page.goto("/dashboard/shop/add");
}

export async function goToEditShop(page: Page, shopId: string) {
  await page.goto(`/dashboard/shop/${shopId}/edit`);
}

export async function goToOrders(page: Page) {
  await page.goto("/dashboard/order/all");
}

export async function goToCustomers(page: Page) {
  await page.goto("/dashboard/customer/all");
}

export async function goToAddCustomer(page: Page) {
  await page.goto("/dashboard/customer/add");
}

export async function goToShopDetail(page: Page, shopId: string) {
  await page.goto(`/dashboard/shop/${shopId}`);
}

export async function goToAddOrder(page: Page) {
  await page.goto("/dashboard/order/add");
}

export async function goToPrintOrder(page: Page, orderId: string) {
  await page.goto(`/dashboard/order/${orderId}/print`);
}

export async function goToProducts(page: Page) {
  await page.goto("/dashboard/product/all");
}

export async function goToAddProduct(page: Page) {
  await page.goto("/dashboard/product/add");
}

export async function goToSuppliers(page: Page) {
  await page.goto("/dashboard/supplier/all");
}

export async function goToAddSupplier(page: Page) {
  await page.goto("/dashboard/supplier/add");
}

export async function goToEmployees(page: Page) {
  await page.goto("/dashboard/employee/all");
}

export async function goToAddEmployee(page: Page) {
  await page.goto("/dashboard/employee/add");
}
