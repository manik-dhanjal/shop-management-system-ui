import {
  InviteMemberPayload,
  MyShopRow,
  MyShopsStats,
  Shop,
  ShopGstDetails,
  ShopMember,
} from "@features/shop/interface/shop.interface";
import { UserRole } from "@shared/enums/user-role.enum";
import { apiClient } from "./client.api";

const SHOP_WRITABLE_KEYS: (keyof Shop)[] = [
  "name", "kind", "status", "description", "logo", "currency", "timezone",
  "billingEmail", "location", "gstDetails", "phone", "email",
  "alternatePhones", "alternateEmails", "contactPersonName",
  "contactPersonDesignation", "contactPersons",
];

const GST_DETAILS_WRITABLE_KEYS: (keyof ShopGstDetails)[] = [
  "gstin", "legalName", "tradeName", "panCardNumber", "address", "state",
  "registrationDate", "status", "constitutionOfBusiness", "einvoiceApplicable",
  "natureOfBusiness", "username", "email",
];

function sanitizeGstDetails(gst: ShopGstDetails): Partial<ShopGstDetails> {
  const result: Partial<ShopGstDetails> = {};
  for (const key of GST_DETAILS_WRITABLE_KEYS) {
    if (key in gst) (result as any)[key] = (gst as any)[key];
  }
  return result;
}

function sanitizeShopPayload(payload: Partial<Shop>): Partial<Shop> {
  const result: Partial<Shop> = {};
  for (const key of SHOP_WRITABLE_KEYS) {
    if (key in payload) {
      const val = payload[key];
      if ((key === "email" || key === "billingEmail") && val === "") continue;
      if (key === "gstDetails" && val) {
        result.gstDetails = sanitizeGstDetails(val as ShopGstDetails);
        continue;
      }
      (result as any)[key] = val;
    }
  }
  return result;
}

export class ShopApi {
  // ---- my shops ----
  static async getMyShops(q?: string): Promise<MyShopRow[]> {
    const response = await apiClient.get("/api/v1/shop/mine", {
      params: q ? { q } : undefined,
    });
    return response.data;
  }

  static async getMyShopsStats(): Promise<MyShopsStats> {
    const response = await apiClient.get("/api/v1/shop/mine/stats");
    return response.data;
  }

  // ---- single shop ----
  static async getShop(shopId: string): Promise<Shop> {
    const response = await apiClient.get(`/api/v1/shop/${shopId}`);
    return response.data;
  }

  static async addShop(shop: Partial<Shop>): Promise<Shop> {
    const response = await apiClient.post("/api/v1/shop", sanitizeShopPayload(shop));
    return response.data;
  }

  static async updateShop(
    shopId: string,
    payload: Partial<Shop>,
  ): Promise<Shop> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}`,
      sanitizeShopPayload(payload),
    );
    return response.data;
  }

  static async deleteShop(shopId: string): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}`);
  }

  // ---- members ----
  static async listMembers(shopId: string): Promise<ShopMember[]> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/members`,
    );
    return response.data;
  }

  static async inviteMember(
    shopId: string,
    payload: InviteMemberPayload,
  ): Promise<{ userId: string; status: "linked" | "invited" }> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/members`,
      payload,
    );
    return response.data;
  }

  static async updateMemberRoles(
    shopId: string,
    userId: string,
    roles: UserRole[],
  ): Promise<void> {
    await apiClient.patch(`/api/v1/shop/${shopId}/members/${userId}`, {
      roles,
    });
  }

  static async removeMember(
    shopId: string,
    userId: string,
  ): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/members/${userId}`);
  }

  // ---- GST verification ----

  static async requestGstOtp(shopId: string, gstin: string): Promise<void> {
    await apiClient.post(`/api/v1/shop/${shopId}/gst/request-otp`, { gstin });
  }

  static async verifyGstOtp(
    shopId: string,
    gstin: string,
    otp: string,
    email?: string,
  ): Promise<ShopGstDetails> {
    const r = await apiClient.post(`/api/v1/shop/${shopId}/gst/verify`, {
      gstin,
      otp,
      email,
    });
    return r.data;
  }
}
