import {
  AddInventory,
  Inventory,
} from "@features/inventory/interface/inventory.interface";
import { apiClient } from "@shared/api/client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";
import { omit as _omit } from "lodash";

export class InventoryApi {
  static async createInventoryItem(
    shopId: string,
    inventoryItem: AddInventory,
  ): Promise<Inventory> {
    const response = await apiClient.post(`/api/v1/shop/${shopId}/inventory`, {
      ...inventoryItem,
    });
    return response.data;
  }

  static async getPaginatedInventory(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<Inventory>,
    sort?: Record<keyof Inventory, string>,
  ): Promise<Pagination<Inventory>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/inventory/paginated`,
      {
        limit,
        page,
        filter,
        sort,
      },
    );
    return response.data;
  }

  static async deleteInventoryItem(
    shopId: string,
    inventoryId: string,
  ): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/inventory/${inventoryId}`);
  }

  static async getInventoryItem(
    shopId: string,
    inventoryId: string,
  ): Promise<Inventory> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/inventory/${inventoryId}`,
    );
    return response.data;
  }

  static async updateInventoryItem(
    shopId: string,
    inventoryId: string,
    inventoryItem: Partial<AddInventory>,
  ): Promise<Inventory> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/inventory/${inventoryId}`,
      inventoryItem,
    );
    return response.data;
  }
}
