import {
  InviteMemberPayload,
  MyShopRow,
  MyShopsStats,
  Shop,
  ShopMember,
} from "@features/shop/interface/shop.interface";
import { UserRole } from "@shared/enums/user-role.enum";
import { apiClient } from "./client.api";

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
    const response = await apiClient.post("/api/v1/shop", shop);
    return response.data;
  }

  static async updateShop(
    shopId: string,
    payload: Partial<Shop>,
  ): Promise<Shop> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}`,
      payload,
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
}
