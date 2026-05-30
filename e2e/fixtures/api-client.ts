/**
 * Authenticated REST helpers for test setup & cleanup.
 *
 * Prefer the UI for the flow under test; use these for preconditions and
 * teardown. Delete order before customer/product (stock guard), customer/
 * supplier before shop (order guard). See docs/e2e-test-plan.md §7.
 */
import { APIRequestContext, request as pwRequest } from "@playwright/test";
import { ADMIN, API_URL, DEMO_SHOP_ID } from "./test-data";

export interface Tokens { access: string; refresh: string; }

export async function login(ctx: APIRequestContext, email: string, password: string): Promise<Tokens> {
  const res = await ctx.post(`${API_URL}/api/v1/user/login`, { data: { email, password } });
  if (!res.ok()) throw new Error(`login failed (${res.status()}): ${await res.text()}`);
  const json = await res.json();
  return { access: json.access.token, refresh: json.refresh.token };
}

const DUMMY_LOCATION = { address: "1 Test St", country: "India", state: "Maharashtra", city: "Mumbai", pinCode: "400001" };

export async function ensureRegistered(ctx: APIRequestContext, u: { email: string; password: string; firstName: string; lastName: string }): Promise<void> {
  const res = await ctx.post(`${API_URL}/api/v1/user/register`, { data: { ...u, location: DUMMY_LOCATION } });
  if (!res.ok() && res.status() !== 409) throw new Error(`register failed (${res.status()}): ${await res.text()}`);
}

export async function ensureMember(ctx: APIRequestContext, adminAccess: string, shopId: string, email: string, roles: string[]): Promise<void> {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/members`, {
    headers: { Authorization: `Bearer ${adminAccess}` },
    data: { email, roles },
  });
  if (!res.ok() && res.status() !== 400) throw new Error(`invite failed (${res.status()}): ${await res.text()}`);
}

export async function adminContext(): Promise<{ ctx: APIRequestContext; access: string }> {
  const ctx = await pwRequest.newContext();
  const { access } = await login(ctx, ADMIN.email, ADMIN.password);
  return { ctx, access };
}

// ── Products ────────────────────────────────────────────────────────────────
export async function createProduct(ctx: APIRequestContext, access: string, shopId: string, data: { name: string; sku: string; sellPrice: number; purchasePrice: number; stock: number; measuringUnit?: string }) {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/product`, {
    headers: { Authorization: `Bearer ${access}` },
    data: {
      name: data.name,
      sku: data.sku,
      sellPrice: data.sellPrice,
      purchasePrice: data.purchasePrice,
      stock: data.stock,
      measuringUnit: data.measuringUnit ?? "Pieces",
      hsn: "0000",
      brand: "E2E",
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 18,
      currency: "INR",
      images: [],
      keywords: [],
      properties: [],
    },
  });
  if (!res.ok()) throw new Error(`createProduct (${res.status()}): ${await res.text()}`);
  return res.json();
}

export async function deleteProduct(ctx: APIRequestContext, access: string, shopId: string, productId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}/product/${productId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Customers ───────────────────────────────────────────────────────────────
export async function createCustomer(ctx: APIRequestContext, access: string, shopId: string, data: { name: string; phone: string; type?: string; status?: string }) {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/customer`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { type: "INDIVIDUAL", status: "ACTIVE", ...data },
  });
  if (!res.ok()) throw new Error(`createCustomer (${res.status()}): ${await res.text()}`);
  return res.json();
}

export async function deleteCustomer(ctx: APIRequestContext, access: string, shopId: string, customerId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}/customer/${customerId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Orders ──────────────────────────────────────────────────────────────────
export async function createOrder(ctx: APIRequestContext, access: string, shopId: string, customerId: string, items: Array<{ productId: string; qty: number; sellPrice: number }>) {
  const orderItems = items.map(i => ({
    product: i.productId,
    quantity: i.qty,
    discount: 0,
    taxableValue: i.sellPrice * i.qty,
    taxes: [],
    totalPrice: i.sellPrice * i.qty,
  }));
  const grandTotal = items.reduce((s, i) => s + i.sellPrice * i.qty, 0);
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/order`, {
    headers: { Authorization: `Bearer ${access}` },
    data: {
      customer: customerId,
      shop: shopId,
      invoiceType: "Tax Invoice",
      items: orderItems,
      billing: { subTotal: grandTotal, discounts: 0, taxes: [], grandTotal, roundOff: 0, finalAmount: grandTotal },
      payment: { paymentMethod: "Cash", status: "Pending", amountPaid: 0, paymentDate: new Date().toISOString() },
      orderDate: new Date().toISOString(),
    },
  });
  if (!res.ok()) throw new Error(`createOrder (${res.status()}): ${await res.text()}`);
  return res.json();
}

export async function deleteOrder(ctx: APIRequestContext, access: string, shopId: string, orderId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}/order/${orderId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Shops ────────────────────────────────────────────────────────────────────
export async function createShop(ctx: APIRequestContext, access: string, name: string) {
  const res = await ctx.post(`${API_URL}/api/v1/shop`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { name, status: "ACTIVE", currency: "INR", timezone: "Asia/Kolkata", alternatePhones: [], alternateEmails: [], contactPersons: [] },
  });
  if (!res.ok()) throw new Error(`createShop (${res.status()}): ${await res.text()}`);
  return res.json();
}

export async function deleteShop(ctx: APIRequestContext, access: string, shopId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Suppliers ────────────────────────────────────────────────────────────────
export async function createSupplier(ctx: APIRequestContext, access: string, shopId: string, name: string, phone?: string) {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/supplier`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { newShop: { name, ...(phone ? { phone } : {}), alternatePhones: [], alternateEmails: [], contactPersons: [] } },
  });
  if (!res.ok()) throw new Error(`createSupplier (${res.status()}): ${await res.text()}`);
  return res.json();
}

export async function deleteSupplier(ctx: APIRequestContext, access: string, shopId: string, supplierId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}/supplier/${supplierId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Members ──────────────────────────────────────────────────────────────────
export async function removeMember(ctx: APIRequestContext, access: string, shopId: string, userId: string) {
  await ctx.delete(`${API_URL}/api/v1/shop/${shopId}/members/${userId}`, {
    headers: { Authorization: `Bearer ${access}` },
  });
}

// ── Paginated list helpers ────────────────────────────────────────────────────
export async function getFirstProduct(ctx: APIRequestContext, access: string, shopId: string) {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/product/paginated`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { limit: 1, page: 1 },
  });
  if (!res.ok()) throw new Error(`getProducts (${res.status()}): ${await res.text()}`);
  const json = await res.json();
  return json.data?.[0] ?? null;
}

export async function getFirstCustomer(ctx: APIRequestContext, access: string, shopId: string) {
  const res = await ctx.post(`${API_URL}/api/v1/shop/${shopId}/customer/paginated`, {
    headers: { Authorization: `Bearer ${access}` },
    data: { limit: 1, page: 1 },
  });
  if (!res.ok()) throw new Error(`getCustomers (${res.status()}): ${await res.text()}`);
  const json = await res.json();
  return json.data?.[0] ?? null;
}

export { DEMO_SHOP_ID };
