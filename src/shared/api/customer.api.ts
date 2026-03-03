import { apiClient } from "@shared/api/client.api";
import { Pagination } from "@shared/interfaces/pagination.interface";
import {
  AddCustomer,
  CustomerPopulated,
} from "@features/customer/interface/customer.interface";

export class CustomerApi {
  static async createCustomer(
    shopId: string,
    payload: AddCustomer,
  ): Promise<CustomerPopulated> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/customer`,
      payload,
    );
    return response.data;
  }

  static async getPaginatedCustomers(
    shopId: string,
    limit: number,
    page: number,
    search?: string,
    sort?: Record<string, string>,
  ): Promise<Pagination<CustomerPopulated>> {
    const response = await apiClient.post(
      `/api/v1/shop/${shopId}/customer/paginated`,
      {
        limit,
        page,
        search,
        sort,
      },
    );
    return response.data;
  }

  static async getCustomer(
    shopId: string,
    customerId: string,
  ): Promise<CustomerPopulated> {
    const response = await apiClient.get(
      `/api/v1/shop/${shopId}/customer/${customerId}`,
    );
    return response.data;
  }

  static async updateCustomer(
    shopId: string,
    customerId: string,
    payload: Partial<AddCustomer>,
  ): Promise<CustomerPopulated> {
    const response = await apiClient.patch(
      `/api/v1/shop/${shopId}/customer/${customerId}`,
      payload,
    );
    return response.data;
  }

  static async deleteCustomer(
    shopId: string,
    customerId: string,
  ): Promise<void> {
    await apiClient.delete(`/api/v1/shop/${shopId}/customer/${customerId}`);
  }
}
