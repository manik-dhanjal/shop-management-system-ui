import { apiClient } from "@shared/api/client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";
import {
  AddSupplier,
  ShopLookupQuery,
  ShopLookupResponse,
  ShopPreview,
  Supplier,
  SupplierShopFormTypes,
  SupplierSuggestions,
} from "@features/supplier/interface/supplier.interface";

export class SupplierApi {
  static async createSupplier(
    shopId: string,
    payload: AddSupplier,
  ): Promise<Supplier> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/supplier`,
      payload,
    );
    return response.data;
  }

  static async getPaginatedSuppliers(
    shopId: string,
    limit: number,
    page: number,
    search?: string,
    sort?: Record<string, string>,
    filter?: Record<string, unknown>,
  ): Promise<Pagination<Supplier>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/supplier/paginated`,
      { limit, page, search, sort, filter },
    );
    return response.data;
  }

  static async getSupplier(
    shopId: string,
    supplierId: string,
  ): Promise<Supplier> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/${supplierId}`,
    );
    return response.data;
  }

  static async updateSupplier(
    shopId: string,
    supplierId: string,
    payload: Partial<AddSupplier>,
  ): Promise<Supplier> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/supplier/${supplierId}`,
      payload,
    );
    return response.data;
  }

  static async updateSupplierShop(
    shopId: string,
    supplierId: string,
    payload: Partial<SupplierShopFormTypes>,
  ): Promise<Supplier> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/supplier/${supplierId}/shop`,
      payload,
    );
    return response.data;
  }

  static async deleteSupplier(
    shopId: string,
    supplierId: string,
  ): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/supplier/${supplierId}`);
  }

  static async previewSupplierCode(
    shopId: string,
  ): Promise<{ supplierCode: string }> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/code/next`,
    );
    return response.data;
  }

  static async getSupplierStats(shopId: string): Promise<{
    totalSuppliers: number;
    activeSuppliers: number;
    withGstin: number;
    totalPayable: number;
  }> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/stats`,
    );
    return response.data;
  }

  static async lookupShops(
    shopId: string,
    query: ShopLookupQuery,
  ): Promise<ShopLookupResponse> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/lookup/shops`,
      { params: query },
    );
    return response.data;
  }

  static async getSuggestions(shopId: string): Promise<SupplierSuggestions> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/suggestions`,
    );
    return response.data;
  }

  static async getShopPreview(
    shopId: string,
    targetShopId: string,
  ): Promise<ShopPreview> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/supplier/shop/${targetShopId}/preview`,
    );
    return response.data;
  }
}
