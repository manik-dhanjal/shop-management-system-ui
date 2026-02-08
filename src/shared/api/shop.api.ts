import { ShopFormType } from "@features/shop/interface/shop-form.interface";
import { Shop } from "@features/shop/interface/shop.interface";
import { apiClient } from "./client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";

export class ShopApi {
  static async addShop(shop: ShopFormType): Promise<Shop<string>> {
    const response = await apiClient.post("/api/v1/shop", shop);
    return response.data;
  }

  static async getPaginatedSuppliers(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<Shop<string>>,
    sort?: Record<keyof Shop<string>, string>,
  ): Promise<Pagination<Shop<string>>> {
    const response = await apiClient.post(`/api/v1/shop/${shopId}/suppliers`, {
      limit,
      page,
      filter,
      sort,
    });
    return response.data;
  }
}
