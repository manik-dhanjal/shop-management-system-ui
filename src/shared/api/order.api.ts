import {
  CreateOrder,
  UpdateOrder,
  Order,
} from "@features/order/interface/order.interface";
import { apiClient } from "./client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";

export class OrderApi {
  static async createOrder(shopId: string, order: CreateOrder): Promise<Order> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/order`,
      order,
    );
    return response.data;
  }

  static async getPaginatedOrders(
    shopId: string,
    limit: number,
    page: number,
    filter?: Partial<CreateOrder>,
    sort?: Record<keyof CreateOrder, string>,
  ): Promise<Pagination<Order>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/order/paginated`,
      {
        limit,
        page,
        filter,
        sort,
      },
    );
    return response.data;
  }

  static async getOrder(shopId: string, orderId: string): Promise<Order> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/order/${orderId}`,
    );
    return response.data;
  }

  static async updateOrder(
    shopId: string,
    orderId: string,
    order: UpdateOrder,
  ): Promise<Order> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/order/${orderId}`,
      order,
    );
    return response.data;
  }

  static async deleteOrder(shopId: string, orderId: string): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/order/${orderId}`);
  }
}
